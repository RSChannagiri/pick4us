import { useMutation } from "convex/react";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { api } from "../../convex/_generated/api";
import { Button, colors } from "../ui";

export default function Home() {
  const createGroup = useMutation(api.groups.createGroup);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const newCode = await createGroup();
    setBusy(false);
    router.push(`/group/${newCode}`);
  }

  function join() {
    router.push(`/group/${code.trim().toUpperCase()}`);
  }

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Where should we eat?</Text>
      <Text style={styles.sub}>
        Everyone says what they want and what they can't eat. Pick4Us finds one place that works
        for the whole group.
      </Text>

      <Button title={busy ? "Creating..." : "Start a group"} onPress={create} disabled={busy} />

      <Text style={styles.or}>or join one</Text>
      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="CODE"
        autoCapitalize="characters"
        maxLength={4}
        style={styles.input}
      />
      <Button title="Join" onPress={join} disabled={code.trim().length !== 4} secondary />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 24, gap: 14, maxWidth: 480, width: "100%", alignSelf: "center" },
  title: { fontSize: 34, fontWeight: "800", color: colors.ink, marginTop: 24 },
  sub: { fontSize: 16, lineHeight: 23, color: colors.muted, marginBottom: 12 },
  or: { textAlign: "center", color: colors.muted, marginTop: 12 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: "center",
    fontWeight: "700",
  },
});
