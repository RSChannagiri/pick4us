import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { api } from "../../../convex/_generated/api";
import { BUDGETS, CUISINES, LIMITS } from "../../options";
import { Button, Chip, colors } from "../../ui";

function toggle(list: string[], item: string) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export default function GroupScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const group = useQuery(api.groups.getGroup, { code });

  if (group === undefined) return <Text style={styles.center}>Loading...</Text>;
  if (group === null) return <Text style={styles.center}>No group with code {code}.</Text>;

  return <Group groupId={group._id} code={group.code} />;
}

function Group({ groupId, code }: { groupId: any; code: string }) {
  const responses = useQuery(api.responses.listResponses, { groupId });
  const result = useQuery(api.pick.getPick, { groupId });
  const submit = useMutation(api.responses.submitResponse);

  const [name, setName] = useState("");
  const [cravings, setCravings] = useState<string[]>([]);
  const [limits, setLimits] = useState<string[]>([]);
  const [budget, setBudget] = useState(2);
  const [saved, setSaved] = useState(false);

  async function onSubmit() {
    await submit({ groupId, name, cravings, limits, budget });
    setSaved(true);
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Stack.Screen options={{ headerTitle: `Group ${code}` }} />

      <View style={styles.codeBox}>
        <Text style={styles.codeLabel}>Share this code</Text>
        <Text style={styles.code}>{code}</Text>
      </View>

      {result?.pick ? (
        <View style={styles.pickCard}>
          <Text style={styles.pickLabel}>The pick</Text>
          <Text style={styles.pickName}>{result.pick.name}</Text>
          <Text style={styles.reason}>{result.reason}</Text>
          {result.backup && <Text style={styles.backup}>Backup: {result.backup.name}</Text>}
        </View>
      ) : (
        result && (
          <View style={styles.pickCard}>
            <Text style={styles.reason}>{result.reason}</Text>
          </View>
        )
      )}

      <Text style={styles.h}>Who's in ({responses?.length ?? 0})</Text>
      <View style={styles.row}>
        {responses?.map((r) => (
          <Text key={r._id} style={styles.person}>
            {r.name}
          </Text>
        ))}
      </View>

      <Text style={styles.h}>Your name</Text>
      <TextInput
        value={name}
        onChangeText={(t) => {
          setName(t);
          setSaved(false);
        }}
        placeholder="Name"
        style={styles.input}
      />

      <Text style={styles.h}>Craving</Text>
      <View style={styles.row}>
        {CUISINES.map((c) => (
          <Chip key={c} label={c} selected={cravings.includes(c)} onPress={() => { setCravings(toggle(cravings, c)); setSaved(false); }} />
        ))}
      </View>

      <Text style={styles.h}>Can't do without</Text>
      <View style={styles.row}>
        {LIMITS.map((l) => (
          <Chip key={l} label={l} selected={limits.includes(l)} onPress={() => { setLimits(toggle(limits, l)); setSaved(false); }} />
        ))}
      </View>

      <Text style={styles.h}>Budget</Text>
      <View style={styles.row}>
        {BUDGETS.map((b) => (
          <Chip key={b.value} label={b.label} selected={budget === b.value} onPress={() => { setBudget(b.value); setSaved(false); }} />
        ))}
      </View>

      <Button
        title={saved ? "Saved. Edit and tap to update" : "Submit"}
        onPress={onSubmit}
        disabled={!name.trim()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { padding: 24, fontSize: 16, color: colors.muted, textAlign: "center" },
  page: { padding: 20, gap: 10, maxWidth: 520, width: "100%", alignSelf: "center", paddingBottom: 60 },
  codeBox: { alignItems: "center", paddingVertical: 8 },
  codeLabel: { color: colors.muted, fontSize: 13, textTransform: "uppercase", letterSpacing: 1 },
  code: { fontSize: 44, fontWeight: "800", letterSpacing: 10, color: colors.ink },
  pickCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.line,
    gap: 6,
  },
  pickLabel: { color: colors.accent, fontWeight: "700", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 },
  pickName: { fontSize: 26, fontWeight: "800", color: colors.ink },
  reason: { fontSize: 15, lineHeight: 21, color: colors.ink },
  backup: { fontSize: 14, color: colors.muted },
  h: { fontSize: 15, fontWeight: "700", color: colors.ink, marginTop: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  person: {
    backgroundColor: "#f1e7d8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    color: colors.ink,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
});
