import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Mail, Lock, UserPlus } from "lucide-react-native";
import { useSession } from "@/services/auth/session";
import { registerUser } from "@/services/auth/authFunctions";
import AnimatedBackgroundMap from "@/src/components/custom/AnimatedBackgroundMap";
import HeaderAuth from "@/src/components/custom/auth/HeaderAuth";
import CardAuth from "@/src/components/custom/auth/CardAuth";
import InputWrapperAuth from "@/src/components/custom/auth/InputWrapperAuth";
import FooterLinkAuth from "@/src/components/custom/auth/FooterLinkAuth";
import Copyright from "@/src/components/custom/auth/Copyright";
import { Text } from "@/components/ui/text";

export default function RegisterScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos para continuar.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await registerUser(email, password);
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || "Erro ao registrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#F2F2EC] justify-center items-center px-5 py-5 overflow-hidden">
      {/* MAPA ANIMADO AO FUNDO */}
      <AnimatedBackgroundMap />

      {/* LOGO / CABEÇALHO */}
      <HeaderAuth subtitle="Faça parte da mudança: reporte problemas e colabore com a sua comunidade." />

      {/* CARD FLUTUANTE DE REGISTRO */}
      <CardAuth
        title="Criar uma Conta"
        subtitle="Crie seu perfil para começar a reportar ocorrências"
      >
        {/* INPUT EMAIL */}
        <InputWrapperAuth
          icon={Mail}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* INPUT SENHA */}
        <InputWrapperAuth
          icon={Lock}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* MENSAGEM DE ERRO */}
        {error && (
          <View className="bg-red-50 rounded-xl p-2.5 border border-red-300 mb-3.5">
            <Text className="text-red-600 text-xs text-center font-semibold">{error}</Text>
          </View>
        )}

        {/* BOTÃO CADASTRAR */}
        <Button
          onPress={handleRegister}
          disabled={loading}
          className="bg-zinc-900 rounded-2xl h-12 justify-center items-center flex-row shadow-sm mt-1 active:bg-zinc-800"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Icon as={UserPlus} size="sm" className="text-white mr-2" />
              <ButtonText className="text-white font-semibold text-sm">Criar Conta</ButtonText>
            </>
          )}
        </Button>

        {/* LINK VOLTAR LOGIN */}
        <FooterLinkAuth
          promptText="Já possui uma conta? "
          linkText="Entrar"
          href="Login"
        />
      </CardAuth>

      {/* RODAPÉ */}
      <Copyright />
    </View>
  );
}
