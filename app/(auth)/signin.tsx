import AuthButton from "@/app/components/AuthButton";
import AuthCard from "@/app/components/AuthCard";
import FormInput from "@/app/components/FormInput";
import { getFieldError, mapClerkError } from "@/lib/auth-errors";
import { validateEmail } from "@/lib/validation";
import { useSignIn } from "@clerk/expo/legacy";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SignInStep = "initial" | "mfa" | "complete";

export default function SignIn() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<SignInStep>("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [formError, setFormError] = useState("");

  const validateForm = (): boolean => {
    setEmailError("");
    setPasswordError("");

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error!);
      return false;
    }

    if (!password) {
      setPasswordError("Password is required");
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    setFormError("");

    if (!isLoaded || !signIn || !validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      // Check if sign-in is complete
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else if (
        signInAttempt.status === "needs_second_factor" ||
        signInAttempt.status === "needs_client_trust"
      ) {
        // Handle MFA/client trust verification
        const emailCodeFactor = (signInAttempt.supportedSecondFactors || []).find(
          (factor: any) => factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({ strategy: "email_code" });
          setStep("mfa");
        } else {
          setFormError(
            "Multi-factor authentication is required but not configured.",
          );
        }
      } else {
        setFormError("Sign-in incomplete. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign-in error:", error);
      const emailFieldError = getFieldError(error, "identifier");
      const passwordFieldError = getFieldError(error, "password");

      if (emailFieldError) {
        setEmailError(emailFieldError);
      } else if (passwordFieldError) {
        setPasswordError(passwordFieldError);
      } else {
        setFormError(mapClerkError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerification = async () => {
    setCodeError("");
    setFormError("");

    if (!code) {
      setCodeError("Verification code is required");
      return;
    }

    if (!isLoaded || !signIn) {
      return;
    }

    try {
      setLoading(true);

      const verifyAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (verifyAttempt.status === "complete") {
        await setActive({ session: verifyAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        setFormError("Verification incomplete. Please try again.");
      }
    } catch (error: any) {
      console.error("MFA verification error:", error);
      const errorMessage = mapClerkError(error);
      if (errorMessage.includes("code")) {
        setCodeError(errorMessage);
      } else {
        setFormError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || !signIn) {
      return;
    }

    try {
      setLoading(true);
      setFormError("");
      await signIn.prepareSecondFactor({ strategy: "email_code" });
      setFormError("New code sent to your email");
    } catch (error: any) {
      console.error("Resend error:", error);
      setFormError(mapClerkError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="auth-screen" style={{ paddingTop: insets.top }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="auth-content">
          {/* Brand Logo */}
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub">SMART BILLING</Text>
              </View>
            </View>
          </View>

          {/* Form Content */}
          <View style={{ flex: 1 }}>
            {step === "initial" && (
              <>
                <Text className="auth-title">Welcome back</Text>
                <Text className="auth-subtitle">
                  Sign in to continue managing your subscriptions
                </Text>

                <AuthCard>
                  <View className="auth-form">
                    <FormInput
                      label="Email"
                      placeholder="you@example.com"
                      value={email}
                      onChangeText={setEmail}
                      error={emailError}
                      keyboardType="email-address"
                      editable={!loading}
                    />

                    <FormInput
                      label="Password"
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      error={passwordError}
                      secureTextEntry
                      editable={!loading}
                    />

                    {formError && (
                      <Text className="auth-error">{formError}</Text>
                    )}

                    <AuthButton
                      title="Sign in"
                      onPress={handleSignIn}
                      disabled={!email || !password}
                      loading={loading}
                    />
                  </View>
                </AuthCard>

                {/* Sign Up Link */}
                <View className="auth-link-row">
                  <Text className="auth-link-copy">New to Recurly?</Text>
                  <Link href="/(auth)/signup">
                    <Text className="auth-link">Create an account</Text>
                  </Link>
                </View>
              </>
            )}

            {step === "mfa" && (
              <>
                <Text className="auth-title">Verify your identity</Text>
                <Text className="auth-subtitle">
                  We sent a code to {email}. Enter it below to confirm.
                </Text>

                <AuthCard>
                  <View className="auth-form">
                    <FormInput
                      label="Verification Code"
                      placeholder="000000"
                      value={code}
                      onChangeText={setCode}
                      error={codeError}
                      keyboardType="default"
                      editable={!loading}
                    />

                    {formError && (
                      <Text
                        className={`auth-error ${formError.includes("sent") ? "text-success" : ""}`}
                      >
                        {formError}
                      </Text>
                    )}

                    <AuthButton
                      title="Verify and continue"
                      onPress={handleMFAVerification}
                      disabled={!code}
                      loading={loading}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 12,
                      }}
                    >
                      <Text className="text-sm font-sans-medium text-muted-foreground">
                        Didn&apos;t receive code?{" "}
                      </Text>
                      <Text
                        className="text-sm font-sans-bold text-accent"
                        onPress={handleResendCode}
                        disabled={loading}
                      >
                        Resend
                      </Text>
                    </View>
                  </View>
                </AuthCard>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
