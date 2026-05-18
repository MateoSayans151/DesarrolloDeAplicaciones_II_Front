import { StyleSheet } from "react-native";

export const inputStyles = StyleSheet.create({
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#e5e2c6",
    fontSize: 16,
    marginBottom: 12,
  },
  passwordContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#bfc8d6",
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#e5e2c6",
    fontSize: 16,
  },
  passwordIcon: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
});
