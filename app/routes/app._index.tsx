import { json } from "@remix-run/node";
import "../styles/data-visualizer.css";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CalendarIcon } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
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

type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
  hoveredLine: string | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const data = [
    { date: "7/01", index: 1500, product: 120, cart: 150, range: "Week" },
    { date: "7/02", index: 1800, product: 125, cart: 160, range: "Week" },
    { date: "7/03", index: 1700, product: 122, cart: 155, range: "Week" },
    { date: "7/04", index: 2100, product: 128, cart: 170, range: "Week" },
    { date: "7/05", index: 2300, product: 130, cart: 180, range: "Week" },
    { date: "7/01", index: 150, product: 20, cart: 50, range: "Day" },
    { date: "7/02", index: 180, product: 25, cart: 60, range: "Day" },
    { date: "7/03", index: 170, product: 22, cart: 55, range: "Day" },
    { date: "7/04", index: 210, product: 28, cart: 70, range: "Day" },
    { date: "7/05", index: 230, product: 30, cart: 80, range: "Day" },
    { date: "7/01", index: 1500, product: 200, cart: 500, range: "Month" },
    { date: "7/05", index: 1000, product: 200, cart: 400, range: "Month" },
    { date: "7/10", index: 3000, product: 200, cart: 600, range: "Month" },
    { date: "7/15", index: 4500, product: 200, cart: 700, range: "Month" },
    { date: "7/20", index: 8500, product: 200, cart: 900, range: "Month" },
    { date: "7/25", index: 6000, product: 200, cart: 1000, range: "Month" },
    { date: "7/30", index: 7000, product: 200, cart: 800, range: "Month" },
  ];

  return json({ chartData: data });
};

const CustomTooltip = (props: CustomTooltipProps) => {
  if (props.active && props.payload && props.payload.length > 0) {
    const item = props.payload.filter(
      (entry: any) => entry.name === props.hoveredLine,
    );
    const { name, value } = item[0] || {};
    if (name && value) {
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
          <div
            style={{ fontWeight: 600, fontSize: "12px", marginBottom: "4px" }}
          >
            {name}
          </div>
          <div style={{ fontSize: "12px" }}>Value: {value}</div>
          <div style={{ fontSize: "12px" }}>Date: {props.label}</div>
        </div>
      );
    }
    return null;
  }

  return null;
};

export default function Index() {
  const { chartData } = useLoaderData<typeof loader>();

  const [active, setActive] = useState(true);

  const [showIndex, setShowIndex] = useState(true);
  const [showProduct, setShowProduct] = useState(true);
  const [showCart, setShowCart] = useState(true);
  const [hoveredLine, setHoveredLine] = useState<string | null>("Index page");

  const [popoverActive, setPopoverActive] = useState(false);
  const [selectedRange, setSelectedRange] = useState("Month");
  const [filteredChartData, setFilteredChartData] = useState(chartData);
  const togglePopoverActive = () => setPopoverActive((active) => !active);

  const timeRanges = ["Day", "Week", "Month"];

  const handleSelect = (value: string) => {
    setSelectedRange(value);
    setPopoverActive(false);
  };

  useEffect(() => {
    const filteredData = chartData?.filter(
      (item: { range: string }) => item.range === selectedRange,
    );
    setFilteredChartData(filteredData);
  }, [chartData, selectedRange]);

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

  return (
    <>
      <Button onClick={toggleModal}>View Chart</Button>

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

          <div className="stat-cards-container">
            {statCard("Index", 500, -2, "page")}
            {statCard("Product", 0, 0, "pages")}
            {statCard("Cart", 100, 2, "pages")}
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

          <div className="chart-container">
            <div className="chart-header">
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

            <div className="chart">
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={filteredChartData}>
                  <Tooltip
                    content={<CustomTooltip hoveredLine={hoveredLine} />}
                  />
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
                      onMouseOver={() => setHoveredLine("Index page")}
                      onMouseLeave={() => setHoveredLine(null)}
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
                      onMouseOver={() => setHoveredLine("Product pages")}
                      onMouseLeave={() => setHoveredLine(null)}
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
                      onMouseOver={() => setHoveredLine("Cart pages")}
                      onMouseLeave={() => setHoveredLine(null)}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Modal.Section>
      </Modal>
    </>
  );
}
