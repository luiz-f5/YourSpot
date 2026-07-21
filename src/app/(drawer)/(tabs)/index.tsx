import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated as RNAnimated,
  Dimensions,
  Modal,
  ActivityIndicator,
  PanResponder
} from "react-native";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Home } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// REANIMATED CONFIGURADO PARA ALTA FLUIDEZ
import { Easing, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { GestureHandlerRootView, Gesture } from "react-native-gesture-handler";

import { useSession } from "@/services/auth/session";
import { useLocation } from "@/src/hooks/useLocation";
import TourGuide, { TourStep } from "@/src/components/custom/TourGuide";
import HomeMenuAnimated from "@/src/components/custom/HomeMenuAnimates";
import LeafletMap from "@/src/components/custom/LeafletMap";
import OcorrenciasPanel from "@/src/components/custom/OcorrenciasPanel";
import DraggableButtons from "@/src/components/custom/DraggableButtons";

import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

const windowWidth = Dimensions.get("window").width;
const CARD_WIDTH = Math.min(windowWidth * 0.85, 340);
const HIDDEN_X = CARD_WIDTH - 24;

const iosSmoothCurve = Easing.bezier(0.16, 1, 0.3, 1);

// MOCK DE DENÚNCIAS PRÓXIMAS PARA O FEED DA ABA
const MOCK_DENUNCIAS = [
  {
    id: "1",
    titulo: "Poste sem iluminação",
    categoria: "Infraestrutura",
    distancia: "200m",
    tempo: "15 min atrás",
    descricao: "Lâmpada queimada há dois dias deixando a rua escura.",
  },
  {
    id: "2",
    titulo: "Atitude suspeita",
    categoria: "Segurança",
    distancia: "450m",
    tempo: "30 min atrás",
    descricao: "Dupla de moto sem placa rondando a rua.",
  },
  {
    id: "3",
    titulo: "Vazamento de água",
    categoria: "Saneamento",
    distancia: "800m",
    tempo: "1 hora atrás",
    descricao: "Cano estourado na calçada vazando bastante água.",
  },
];

export default function App() {
  const { signOut } = useSession();
  const { region, setRegion, errorMsg, loading } = useLocation();
  const [showHomeMenu, setShowHomeMenu] = useState<boolean>(false);
  const [showCameraPopup, setShowCameraPopup] = useState<boolean>(false);
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const router = useRouter();

  // Estados do Tour Guiado
  const [tourVisible, setTourVisible] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  const tourSteps: TourStep[] = [
    {
      title: "📍 Denúncias da Região",
      description: "Puxe a barra lateral para acompanhar denúncias e ocorrências em tempo real perto de você.",
      position: { top: 120, left: 20 }
    },
    {
      title: "📸 Denúncia Urbana",
      description: "Encontrou um problema na sua rua? Clique aqui para tirar foto e reportar diretamente para a prefeitura.",
      position: { bottom: 130, right: 20 }
    },
    {
      title: "🏠 Menu Principal",
      description: "Acesse seus locais salvos, veja os detalhes do app ou encerre sua sessão com segurança.",
      position: { bottom: 130, left: 30 }
    }
  ];

  const translateX = useSharedValue(HIDDEN_X);
  const contextX = useSharedValue(0);

  useEffect(() => {
    async function checkFirstRun() {
      try {
        const hasSeenTour = await AsyncStorage.getItem("@yourspot_tour_seen");
        if (!hasSeenTour) {
          setTimeout(() => setTourVisible(true), 1000);
        }
      } catch (e) {}
    }
    checkFirstRun();
  }, []);

  const finishTour = async () => {
    setTourVisible(false);
    try {
      await AsyncStorage.setItem("@yourspot_tour_seen", "true");
    } catch (e) {}
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  const toggleCard = () => {
    if (isCardOpen) {
      translateX.value = withTiming(HIDDEN_X, { duration: 350, easing: iosSmoothCurve });
      setIsCardOpen(false);
    } else {
      translateX.value = withTiming(0, { duration: 400, easing: iosSmoothCurve });
      setIsCardOpen(true);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
    })
    .onUpdate((event) => {
      let newX = contextX.value + event.translationX;
      if (newX < 0) newX = 0;
      if (newX > HIDDEN_X) newX = HIDDEN_X;
      translateX.value = newX;
    })
    .onEnd((event) => {
      if (event.velocityX < -500 || translateX.value < HIDDEN_X / 2) {
        translateX.value = withTiming(0, { duration: 300, easing: iosSmoothCurve });
        runOnJS(setIsCardOpen)(true);
      } else {
        translateX.value = withTiming(HIDDEN_X, { duration: 300, easing: iosSmoothCurve });
        runOnJS(setIsCardOpen)(false);
      }
    });

  const BUTTON_SIZE = 52;
  const MARGIN = 16;
  const panSettings = useRef(new RNAnimated.ValueXY({ x: Dimensions.get("window").width - 70, y: 480 })).current;
  const panCamera = useRef(new RNAnimated.ValueXY({ x: Dimensions.get("window").width - 70, y: 550 })).current;

  const checkAndResolveCollision = (movedButton: 'settings' | 'camera') => {
    const xS = (panSettings.x as any)._value;
    const yS = (panSettings.y as any)._value;
    const xC = (panCamera.x as any)._value;
    const yC = (panCamera.y as any)._value;
    const distance = Math.sqrt(Math.pow(xS - xC, 2) + Math.pow(yS - yC, 2));

    if (distance < BUTTON_SIZE + 5) {
      const window = Dimensions.get("window");
      if (movedButton === 'settings') {
        let newX = xS - 60 < MARGIN ? xS + 60 : xS - 60;
        let newY = yS - 30 < MARGIN + 40 ? yS + 60 : yS - 30;
        RNAnimated.spring(panSettings, { toValue: { x: newX, y: newY }, useNativeDriver: false, bounciness: 12 }).start();
      } else {
        let newX = xC - 60 < MARGIN ? xC + 60 : xC - 60;
        let newY = yC + 60 > window.height - BUTTON_SIZE - MARGIN - 100 ? yC - 60 : yC + 60;
        RNAnimated.spring(panCamera, { toValue: { x: newX, y: newY }, useNativeDriver: false, bounciness: 12 }).start();
      }
    }
  };

  const isDraggingSettings = useRef(false);
  const isDraggingCamera = useRef(false);

  const responderSettings = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDraggingSettings.current = false;
        panSettings.setOffset({ x: (panSettings.x as any)._value, y: (panSettings.y as any)._value });
        panSettings.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, state) => {
        isDraggingSettings.current = true;
        const window = Dimensions.get("window");
        const absX = state.dx + (panSettings.x as any)._offset;
        const absY = state.dy + (panSettings.y as any)._offset;
        const clX = Math.min(Math.max(MARGIN, absX), window.width - BUTTON_SIZE - MARGIN);
        const clY = Math.min(Math.max(MARGIN + 40, absY), window.height - BUTTON_SIZE - MARGIN - 100);
        panSettings.x.setValue(clX - (panSettings.x as any)._offset);
        panSettings.y.setValue(clY - (panSettings.y as any)._offset);
      },
      onPanResponderRelease: () => {
        panSettings.flattenOffset();
        checkAndResolveCollision('settings');
        setTimeout(() => { isDraggingSettings.current = false; }, 100);
      }
    })
  ).current;

  const responderCamera = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        isDraggingCamera.current = false;
        panCamera.setOffset({ x: (panCamera.x as any)._value, y: (panCamera.y as any)._value });
        panCamera.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, state) => {
        isDraggingCamera.current = true;
        const window = Dimensions.get("window");
        const absX = state.dx + (panCamera.x as any)._offset;
        const absY = state.dy + (panCamera.y as any)._offset;
        const clX = Math.min(Math.max(MARGIN, absX), window.width - BUTTON_SIZE - MARGIN);
        const clY = Math.min(Math.max(MARGIN + 40, absY), window.height - BUTTON_SIZE - MARGIN - 100);
        panCamera.x.setValue(clX - (panCamera.x as any)._offset);
        panCamera.y.setValue(clY - (panCamera.y as any)._offset);
      },
      onPanResponderRelease: () => {
        panCamera.flattenOffset();
        checkAndResolveCollision('camera');
        setTimeout(() => { isDraggingCamera.current = false; }, 100);
      }
    })
  ).current;

  if (loading || !region) {
    return (
      <View className="flex-1 bg-[#F9F9F6] justify-center items-center">
        <ActivityIndicator size="large" color="#1C1C1E" />
        <Text className="mt-3 font-semibold text-zinc-600">Buscando sua localização...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-[#F9F9F6]">
        {/* MAPA INTERATIVO */}
        <LeafletMap
          latitude={region.latitude}
          longitude={region.longitude}
          onLocationChanged={(lat, lng) => setRegion(prev => prev ? { ...prev, latitude: lat, longitude: lng } : null)}
        />

        {/* PAINEL LATERAL DE OCORRÊNCIAS */}
        <OcorrenciasPanel
          isCardOpen={isCardOpen}
          toggleCard={toggleCard}
          errorMsg={errorMsg}
          latitude={region.latitude}
          longitude={region.longitude}
          denuncias={MOCK_DENUNCIAS}
          onNewDenuncia={() => router.push("/report")}
          panGesture={panGesture}
          translateX={translateX}
        />

        {/* BOTÕES FLUTUANTES DRAGGABLE */}
        <DraggableButtons
          panSettings={panSettings}
          panCamera={panCamera}
          responderSettings={responderSettings}
          responderCamera={responderCamera}
          isDraggingSettings={isDraggingSettings}
          isDraggingCamera={isDraggingCamera}
          onSettingsPress={() => router.push("/settings")}
          onCameraPress={() => setShowCameraPopup(true)}
        />

        {/* TOUR GUIADO */}
        <TourGuide
          visible={tourVisible}
          currentStep={currentTourStep}
          steps={tourSteps}
          onNext={() => {
            if (currentTourStep < tourSteps.length - 1) {
              setCurrentTourStep(prev => prev + 1);
            } else {
              finishTour();
            }
          }}
          onSkip={finishTour}
        />

        {/* MENU PRINCIPAL (HOME) */}
        <HomeMenuAnimated
          visible={showHomeMenu}
          onClose={() => setShowHomeMenu(false)}
          onSignOut={handleSignOut}
          onNavigate={(route) => router.push(route as any)}
        />

        {/* POP-UP MODAL */}
        <Modal visible={showCameraPopup} transparent={true} animationType="none">
          <View className="flex-1 bg-black/25 justify-center items-center">
            {showCameraPopup && (
              <Animated.View entering={FadeInDown.duration(350).easing(iosSmoothCurve)} exiting={FadeOutDown.duration(220)} className="w-[85%] max-w-[320px]">
                <BlurView intensity={80} tint="light" className="p-6 rounded-[28px] bg-white/75 border border-white/80 shadow-2xl overflow-hidden">
                  <Heading className="text-center text-zinc-900 mb-3 font-bold" size="md">Denúncia Urbana</Heading>
                  <Text className="text-center text-zinc-700 text-sm leading-relaxed mb-5 font-medium">Encontrou um problema na sua rua? Selecione e tire uma foto para notificar a prefeitura.</Text>
                  <View className="flex-row justify-between w-full">
                    <TouchableOpacity className="flex-1 py-3 rounded-2xl items-center mx-1.5 bg-zinc-400/20" onPress={() => setShowCameraPopup(false)}>
                      <Text className="text-sm font-semibold text-zinc-700">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 py-3 rounded-2xl items-center mx-1.5 bg-zinc-900 active:bg-zinc-800" onPress={() => { setShowCameraPopup(false); router.push("/report"); }}>
                      <Text className="text-sm font-semibold text-white">Prosseguir</Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>
            )}
          </View>
        </Modal>

        {/* BOTÃO HOME */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="absolute bottom-10 z-50 self-center"
          style={{ left: (Dimensions.get("window").width / 2) - 32 }}
          onPress={() => setShowHomeMenu(!showHomeMenu)}
        >
          <BlurView intensity={70} tint="light" className={`w-16 h-16 rounded-full justify-center items-center border border-white/80 shadow-lg overflow-hidden bg-white/65 ${showHomeMenu ? 'bg-zinc-100/85' : ''}`} style={showHomeMenu ? { transform: [{ scale: 0.95 }] } : undefined}>
            <Icon as={Home} size="xl" className="text-zinc-900" />
          </BlurView>
        </TouchableOpacity>

      </View>
    </GestureHandlerRootView>
  );
}
