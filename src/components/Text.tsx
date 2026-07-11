import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import sendMessage from "../services/sendMessage";

export default function MyText() {
  const [message, setMessage] = useState<string | undefined>("");

  useEffect(() => {
    const msg: Promise<any> = sendMessage();
    const myString: string = msg as unknown as string;
    setMessage(myString);
  }, []);

  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: "whitesmoke",
    fontSize: 20,
    fontFamily: "Times News Roman",
  },
});
