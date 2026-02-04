import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function KYCScreen() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [idImage, setIdImage] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  async function pickImage(setter: (v: string) => void) {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) setter(res.assets[0].uri);
  }

  function submitKYC() {
    console.log({ idImage, selfie, address });
    setStep(4); // pending
    setTimeout(() => setStep(5), 2500); // simulate verification
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="KYC Verification" onBack={() => router.back()} />

      <View style={styles.container}>
        {step === 1 && (
          <>
            <Title text="Upload Government ID" />
            <Sub text="Take a photo of your passport, driver’s license, or national ID." />

            <UploadBox
              label="Upload ID Document"
              image={idImage}
              onPress={() => pickImage((v) => setIdImage(v))}
            />

            <Next disabled={!idImage} onPress={() => setStep(2)} />
          </>
        )}

        {step === 2 && (
          <>
            <Title text="Selfie Verification" />
            <Sub text="Take a clear selfie to match your ID." />

            <UploadBox
              label="Take Selfie"
              image={selfie}
              onPress={() => pickImage((v) => setSelfie(v))}
            />

            <Next disabled={!selfie} onPress={() => setStep(3)} />
          </>
        )}

        {step === 3 && (
          <>
            <Title text="Proof of Address" />
            <Sub text="Enter your current residential address." />

            <TextInput
              placeholder="Your full address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />

            <Next disabled={!address} onPress={submitKYC} />
          </>
        )}

        {step === 4 && (
          <>
            <Ionicons name="time-outline" size={60} color="#f59e0b" />
            <Title text="Verification in progress" />
            <Sub text="We're reviewing your documents. This usually takes a few minutes." />
          </>
        )}

        {step === 5 && (
          <>
            <Ionicons name="checkmark-circle" size={64} color="#16a34a" />
            <Title text="Verification Complete" />
            <Sub text="Your identity has been verified successfully." />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={26} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 26 }} />
    </View>
  );
}

function UploadBox({
  label,
  image,
  onPress,
}: {
  label: string;
  image: string | null;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.uploadBox} onPress={onPress}>
      {image ? (
        <Image source={{ uri: image }} style={styles.preview} />
      ) : (
        <>
          <Ionicons name="cloud-upload-outline" size={42} color="#2563eb" />
          <Text style={styles.uploadText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function Title({ text }: { text: string }) {
  return <Text style={styles.title}>{text}</Text>;
}

function Sub({ text }: { text: string }) {
  return <Text style={styles.sub}>{text}</Text>;
}

function Next({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryBtn, disabled && { opacity: 0.5 }]}
    >
      <Text style={styles.primaryText}>Continue</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },

  sub: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },

  uploadBox: {
    width: "100%",
    height: 200,
    backgroundColor: "#eef2ff",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },

  uploadText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#2563eb",
  },

  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 24,
  },

  primaryBtn: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
