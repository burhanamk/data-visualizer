import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { CalendarIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import {
  Modal,
  Button,
  Text,
  InlineStack,
  Box,
  Checkbox,
  Divider,
  Popover,
  ActionList,
} from "@shopify/polaris";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const loader: LoaderFunction = async () => {
  const data = [
    { date: "4/01", index: 1500, product: 200, cart: 500 },
    { date: "4/05", index: 1000, product: 200, cart: 400 },
    { date: "4/10", index: 3000, product: 200, cart: 600 },
    { date: "4/15", index: 4500, product: 200, cart: 700 },
    { date: "4/20", index: 8500, product: 200, cart: 900 },
    { date: "4/25", index: 6000, product: 200, cart: 1000 },
    { date: "4/30", index: 7000, product: 200, cart: 800 },
  ];
  return json({ chartData: data });
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    console.log("item: ", item);
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: 6,
          padding: "8px 12px",
          fontSize: 14,
          boxShadow: "0 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ fontWeight: "600", fontSize: "12px" }}>{item.name}</h1>
        <h4 style={{ fontSize: "12px" }}>Views: {item.value}</h4>
        <h4 style={{ fontSize: "12px" }}>Date: {label}</h4>
      </div>
    );
  }

  return null;
};

export default function Index() {
  const fetcher = useFetcher();
  const { chartData } = useLoaderData<typeof loader>();
  // const chartData =
  //   fetcher.data?.chartData || useLoaderData<typeof loader>().chartData;

  const [active, setActive] = useState(true);

  const [showIndex, setShowIndex] = useState(true);
  const [showProduct, setShowProduct] = useState(true);
  const [showCart, setShowCart] = useState(true);

  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Month");

  const togglePopoverActive = () => setPopoverActive((active) => !active);

  const timeRanges = ["Day", "Week", "Month"];

  const handleSelect = (value: string) => {
    setSelectedRange(value);
    fetcher.load(`/?range=${value}`);
    setPopoverActive(false);
  };

  const toggleModal = () => setActive(!active);

  const statCard = (
    title: string,
    value: number,
    change: number,
    subTitle: string,
  ) => {
    const positive = change >= 0;
    const posValue = value > 0;
    return (
      <div
        style={{
          width: "182px",
          height: "76px",
          padding: "10px",
          boxShadow: "0 0 0 1px #E3E3E3, 0 1px 1px #B5B5B5",
          borderRadius: "6px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
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

  return (
    <>
      <Button onClick={toggleModal}>View Chart</Button>

      <div className="chart-container">
        <Modal open={active} onClose={toggleModal} title="Page views">
          <Modal.Section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                padding: "10px 0 10px 0",
              }}
            >
              <Text variant="headingMd" as="h2" fontWeight="semibold">
                <span style={{ fontSize: "16px" }}>Page views statistics</span>
              </Text>

              <Popover
                active={popoverActive}
                activator={
                  <Button
                    icon={CalendarIcon}
                    onClick={togglePopoverActive}
                    disclosure
                  >
                    {selectedRange}
                  </Button>
                }
                onClose={togglePopoverActive}
              >
                <ActionList
                  items={timeRanges.map((label) => ({
                    content: label,
                    onAction: () => handleSelect(label),
                  }))}
                />
              </Popover>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "10px 0",
                flexWrap: "wrap",
                gap: "20px",
                marginBottom: 5,
              }}
            >
              {/* <InlineStack gap="100"> */}
                {statCard("Index", 500, -2, "page")}
                {statCard("Product", 0, 0, "pages")}
                {statCard("Cart", 100, 2, "pages")}
              {/* </InlineStack> */}
            </div>

            <Divider />

            <div style={{ padding: "20px 0" }}>
              <InlineStack gap="200" align="start">
                <Checkbox
                  label="Index page"
                  checked={showIndex}
                  onChange={setShowIndex}
                />
                <Checkbox
                  label="Product pages"
                  checked={showProduct}
                  onChange={setShowProduct}
                />
                <Checkbox
                  label="Cart pages"
                  checked={showCart}
                  onChange={setShowCart}
                />
              </InlineStack>
            </div>

            <div
              style={{
                border: "1px solid #E3E3E3",
                borderRadius: "10px",
                height: "362px",
                padding: 10,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingBottom: "10px",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <InlineStack gap="100" align="center" blockAlign="center">
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: "#008060",
                      borderRadius: 2,
                    }}
                  />
                  <h1>Index page</h1>
                </InlineStack>
                <InlineStack gap="100" align="center" blockAlign="center">
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: "#eec200",
                      borderRadius: 2,
                    }}
                  />
                  <h1>Product pages</h1>
                </InlineStack>
                <InlineStack gap="100" align="center" blockAlign="center">
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      backgroundColor: "#1a73e8",
                      borderRadius: 2,
                    }}
                  />
                  <h1>Cart pages</h1>
                </InlineStack>
              </div>

              <Box>
                <div style={{ height: 310, padding: 0 }}>
                  <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={chartData}>
                      <Tooltip content={<CustomTooltip />} />
                      <XAxis
                        dataKey="date"
                        padding={{ left: 20, right: 20 }}
                        color="gray"
                        tickMargin={20}
                        tickLine={false}
                        axisLine={{ stroke: "#E3E3E3" }}
                        tick={{ fill: "#616161", fontSize: 11 }}
                      />
                      <YAxis
                        ticks={[0, 2000, 4000, 6000, 8000, 10000]}
                        tickFormatter={(value) => `${value / 1000}k`}
                        tickMargin={20}
                        tickLine={false}
                        axisLine={{ stroke: "#E3E3E3" }}
                        tick={{ fill: "#616161", fontSize: 11 }}
                      />
                      {showIndex && (
                        <Line
                          type="monotone"
                          dataKey="index"
                          stroke="#008060"
                          strokeWidth={2}
                          name="Index page"
                          dot={false}
                        />
                      )}
                      {showProduct && (
                        <Line
                          type="monotone"
                          dataKey="product"
                          stroke="#eec200"
                          strokeWidth={2}
                          name="Product pages"
                          dot={false}
                        />
                      )}
                      {showCart && (
                        <Line
                          type="monotone"
                          dataKey="cart"
                          stroke="#1a73e8"
                          strokeWidth={2}
                          name="Cart pages"
                          dot={false}
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Box>
            </div>
          </Modal.Section>
        </Modal>
      </div>
    </>
  );
}
