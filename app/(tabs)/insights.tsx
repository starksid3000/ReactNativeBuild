import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import { colors } from "@/constants/theme";
import { formatCurrency, formatStatusLabel } from "@/lib/utils";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const normalizeToMonthly = (price: number, billing?: string) =>
  billing?.toLowerCase() === "yearly" ? price / 12 : price;

const formatRelativeRenewal = (renewalDate?: string) => {
  if (!renewalDate) return "No renewal date";

  const renewal = dayjs(renewalDate);
  if (!renewal.isValid()) return "No renewal date";

  const days = renewal.startOf("day").diff(dayjs().startOf("day"), "day");

  if (days > 1) return `Renews in ${days} days`;
  if (days === 1) return "Renews tomorrow";
  if (days === 0) return "Renews today";
  if (days === -1) return "Renewed yesterday";

  return `Renewed ${Math.abs(days)} days ago`;
};

export default function Insights() {
  const subscriptions = HOME_SUBSCRIPTIONS;

  const totalMonthlySpend = subscriptions.reduce(
    (sum, item) => sum + normalizeToMonthly(item.price, item.billing),
    0,
  );

  const annualProjection = totalMonthlySpend * 12;

  const activeCount = subscriptions.filter(
    (item) => item.status?.toLowerCase() === "active",
  ).length;

  const mostExpensivePlan = subscriptions.reduce((current, item) => {
    const currentValue = normalizeToMonthly(current.price, current.billing);
    const nextValue = normalizeToMonthly(item.price, item.billing);
    return nextValue > currentValue ? item : current;
  }, subscriptions[0]);

  const spendByCategory = Object.values(
    subscriptions.reduce<Record<string, { label: string; total: number }>>(
      (acc, item) => {
        const key = item.category?.trim() || "Other";
        if (!acc[key]) acc[key] = { label: key, total: 0 };
        acc[key].total += normalizeToMonthly(item.price, item.billing);
        return acc;
      },
      {},
    ),
  ).sort((a, b) => b.total - a.total);

  const maxCategorySpend = spendByCategory[0]?.total ?? 1;

  const statusBreakdown = ["active", "paused", "cancelled"].map((status) => ({
    status,
    count: subscriptions.filter(
      (item) => item.status?.toLowerCase() === status,
    ).length,
  }));

  const renewalTimeline = [...subscriptions]
    .sort((a, b) => {
      const aTime = a.renewalDate ? dayjs(a.renewalDate).valueOf() : 0;
      const bTime = b.renewalDate ? dayjs(b.renewalDate).valueOf() : 0;
      return bTime - aTime;
    })
    .slice(0, 4);

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-5">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
      >
        <View className="mb-6">
          <Text className="text-4xl font-sans-extrabold text-primary">
            Insights
          </Text>
          <Text className="mt-2 text-base font-sans-medium text-black/60">
            A quick read on your subscription habits and renewal rhythm.
          </Text>
        </View>

        <View className="mb-6 rounded-[28px] bg-primary p-6">
          <Text className="text-base font-sans-semibold text-white/70">
            Estimated monthly spend
          </Text>
          <Text className="mt-3 text-4xl font-sans-extrabold text-white">
            {formatCurrency(totalMonthlySpend)}
          </Text>
          <View className="mt-5 flex-row flex-wrap gap-3">
            <View className="min-w-[140px] flex-1 rounded-2xl bg-white/10 p-4">
              <Text className="text-sm font-sans-medium text-white/70">
                Annual projection
              </Text>
              <Text className="mt-2 text-xl font-sans-bold text-white">
                {formatCurrency(annualProjection)}
              </Text>
            </View>
            <View className="min-w-[140px] flex-1 rounded-2xl bg-white/10 p-4">
              <Text className="text-sm font-sans-medium text-white/70">
                Active plans
              </Text>
              <Text className="mt-2 text-xl font-sans-bold text-white">
                {activeCount} of {subscriptions.length}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6 flex-row flex-wrap gap-4">
          <View className="min-w-[150px] flex-1 rounded-3xl border border-border bg-card p-5">
            <Text className="text-sm font-sans-medium text-black/60">
              Highest monthly plan
            </Text>
            <View className="mt-4 flex-row items-center gap-3">
              <Image
                source={mostExpensivePlan.icon}
                className="size-12 rounded-xl"
              />
              <View className="min-w-0 flex-1">
                <Text
                  className="text-lg font-sans-bold text-primary"
                  numberOfLines={1}
                >
                  {mostExpensivePlan.name}
                </Text>
                <Text className="text-sm font-sans-medium text-black/60">
                  {formatCurrency(
                    normalizeToMonthly(
                      mostExpensivePlan.price,
                      mostExpensivePlan.billing,
                    ),
                    mostExpensivePlan.currency,
                  )}
                  {" / month"}
                </Text>
              </View>
            </View>
          </View>

          <View className="min-w-[150px] flex-1 rounded-3xl border border-border bg-card p-5">
            <Text className="text-sm font-sans-medium text-black/60">
              Portfolio health
            </Text>
            <View className="mt-4 gap-3">
              {statusBreakdown.map((item) => (
                <View
                  key={item.status}
                  className="flex-row items-center justify-between"
                >
                  <Text className="text-base font-sans-semibold text-primary">
                    {formatStatusLabel(item.status)}
                  </Text>
                  <View className="rounded-full bg-muted px-3 py-1">
                    <Text className="text-sm font-sans-bold text-primary">
                      {item.count}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="mb-6 rounded-3xl border border-border bg-card p-5">
          <Text className="text-2xl font-sans-bold text-primary">
            Spend by category
          </Text>
          <Text className="mt-1 text-sm font-sans-medium text-black/60">
            Normalized to monthly cost for easier comparison.
          </Text>

          <View className="mt-5 gap-4">
            {spendByCategory.map((item) => (
              <View key={item.label}>
                <View className="mb-2 flex-row items-center justify-between gap-3">
                  <Text className="flex-1 text-base font-sans-semibold text-primary">
                    {item.label}
                  </Text>
                  <Text className="text-base font-sans-bold text-primary">
                    {formatCurrency(item.total)}
                  </Text>
                </View>
                <View className="h-3 overflow-hidden rounded-full bg-muted">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(
                        (item.total / maxCategorySpend) * 100,
                        12,
                      )}%`,
                      backgroundColor: colors.accent,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-3xl border border-border bg-card p-5">
          <Text className="text-2xl font-sans-bold text-primary">
            Renewal activity
          </Text>
          <Text className="mt-1 text-sm font-sans-medium text-black/60">
            Your most recent billing checkpoints across plans.
          </Text>

          <View className="mt-5 gap-4">
            {renewalTimeline.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center gap-4 rounded-2xl bg-background p-4"
              >
                <Image source={item.icon} className="size-12 rounded-xl" />
                <View className="min-w-0 flex-1">
                  <Text
                    className="text-base font-sans-bold text-primary"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="mt-1 text-sm font-sans-medium text-black/60">
                    {formatRelativeRenewal(item.renewalDate)}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-base font-sans-bold text-primary">
                    {formatCurrency(item.price, item.currency)}
                  </Text>
                  <Text className="mt-1 text-sm font-sans-medium text-black/60">
                    {item.billing}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
