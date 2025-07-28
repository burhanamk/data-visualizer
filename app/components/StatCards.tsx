import { InlineStack, Text } from "@shopify/polaris";
import '../styles/data-visualizer.css'
export const statCard = (
  title: string,
  value: number,
  change: number,
  subTitle: string,
) => {
  const positive = change >= 0;
  const posValue = value > 0;
  return (
    <div className="stat-cards">
      <InlineStack gap="100" align="space-between" blockAlign="center">
        <Text as="h1" variant="bodyMd" fontWeight="medium">
          <span style={{ fontSize: "13px" }}>{title}</span>
        </Text>
        <Text as="h5" variant="bodyMd" fontWeight="medium">
          <span
            style={{
              color: posValue ? "#0C5132" : "#000000",
              fontSize: "16px",
            }}
          >
            {value > 0 ? `+${value}` : value}
          </span>
        </Text>
      </InlineStack>
      <InlineStack gap="100" align="space-between" blockAlign="center">
        <Text as="h3" variant="bodyMd" fontWeight="medium">
          <span style={{ fontSize: "13px" }}>{subTitle}</span>
        </Text>
        <Text as="h3" variant="bodyMd" fontWeight="regular">
          <span style={{ color: positive ? "#008060" : "#8E1F0B" }}>
            {(positive ? "+" : "") + String(change) + "%"}
          </span>
        </Text>
      </InlineStack>
    </div>
  );
};