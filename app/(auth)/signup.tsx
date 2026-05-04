import AuthButton from "@/app/components/AuthButton";
import AuthCard from "@/app/components/AuthCard";
import FormInput from "@/app/components/FormInput";
import { getFieldError, mapClerkError } from "@/lib/auth-errors";
import {
    validateEmail,
    validatePassword,
    validatePasswordsMatch,
} from "@/lib/validation";
import { useSignUp } from "@clerk/expo/legacy";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SignUpStep = "initial" | "verification" | "complete";

export default function SignUp() {
  const router = useRouter();
  const { signUp, setActive, isLoaded } = useSignUp();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<SignUpStep>("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [formError, setFormError] = useState("");

  const validateForm = (): boolean => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error!);
      return false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error!);
      return false;
    }

    const matchValidation = validatePasswordsMatch(password, confirmPassword);
    if (!matchValidation.valid) {
      setConfirmPasswordError(matchValidation.error!);
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    setFormError("");

    if (!isLoaded || !signUp || !validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const signUpAttempt = await signUp.create({
        emailAddress: email,
        password: password,
      });

      console.log("Sign-up status:", signUpAttempt.status);
      console.log("Unverified fields:", signUpAttempt.unverifiedFields);

      // Always prepare email verification after successful creation
      if (signUpAttempt.status === "missing_requirements") {
        if (signUpAttempt.unverifiedFields.includes("email_address")) {
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setStep("verification");
        } else {
          // No email verification needed, complete sign-up
          if (signUpAttempt.createdSessionId) {
            await setActive({ session: signUpAttempt.createdSessionId });
            router.replace("/(tabs)");
          }
        }
      } else if (signUpAttempt.status === "complete") {
        // Account created and verified (shouldn't happen with email verification required)
        if (signUpAttempt.createdSessionId) {
          await setActive({ session: signUpAttempt.createdSessionId });
          router.replace("/(tabs)");
        }
      } else {
        // Handle other statuses
        console.warn("Unexpected sign-up status:", signUpAttempt.status);
        setFormError("An unexpected error occurred. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign-up error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      const fieldError =
        getFieldError(error, "email_address") ||
        getFieldError(error, "password") ||
        getFieldError(error, "emailAddress");
      if (fieldError) {
        if (fieldError.toLowerCase().includes("email")) {
          setEmailError(fieldError);
        } else {
          setPasswordError(fieldError);
        }
      } else {
        setFormError(mapClerkError(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    setCodeError("");
    setFormError("");

    if (!code) {
      setCodeError("Verification code is required");
      return;
    }

    if (!isLoaded || !signUp) {
      return;
    }

    try {
      setLoading(true);

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(tabs)");
      } else {
        setFormError("Verification incomplete. Please try again.");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
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
    if (!isLoaded || !signUp) {
      return;
    }

    try {
      setLoading(true);
      setFormError("");
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
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
        scrollEnabled={step === "verification"}
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
                <Text className="auth-title">Create your account</Text>
                <Text className="auth-subtitle">
                  Manage your subscriptions with ease
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
                      placeholder="Create a strong password"
                      value={password}
                      onChangeText={setPassword}
                      error={passwordError}
                      secureTextEntry
                      editable={!loading}
                    />

                    <FormInput
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      error={confirmPasswordError}
                      secureTextEntry
                      editable={!loading}
                    />

                    {formError && (
                      <Text className="auth-error">{formError}</Text>
                    )}

                    <Text className="auth-helper">
                      Password must be at least 8 characters with uppercase,
                      number, and special character
                    </Text>

                    <AuthButton
                      title="Create account"
                      onPress={handleSignUp}
                      disabled={!email || !password || !confirmPassword}
                      loading={loading}
                    />
                  </View>
                </AuthCard>

                {/* Sign In Link */}
                <View className="auth-link-row">
                  <Text className="auth-link-copy">
                    Already have an account?
                  </Text>
                  <Link href="/(auth)/signin">
                    <Text className="auth-link">Sign in</Text>
                  </Link>
                </View>
              </>
            )}

            {step === "verification" && (
              <>
                <Text className="auth-title">Verify your email</Text>
                <Text className="auth-subtitle">
                  We sent a code to {email}. Enter it below to confirm your
                  account.
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
                      onPress={handleVerification}
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
