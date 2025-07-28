import { json } from "@remix-run/node";
import "../styles/data-visualizer.css";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  InlineStack,
  Checkbox,
  Divider,
  Grid,
} from "@shopify/polaris";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { statCard } from "app/components/StatCards";
import {
  useAppBridge,
  Modal as AppBridgeModal,
  TitleBar,
} from "@shopify/app-bridge-react";
import { CustomSelect } from "app/components/CustomDropdown";

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
  const shopify = useAppBridge();
  const [showIndex, setShowIndex] = useState(true);
  const [showProduct, setShowProduct] = useState(true);
  const [showCart, setShowCart] = useState(true);
  const [hoveredLine, setHoveredLine] = useState<string | null>("Index page");
  const [selectedRange, setSelectedRange] = useState("Month");
  const [filteredChartData, setFilteredChartData] = useState(chartData);
  const [modalOpen, setModalOpen] = useState(true);


  const toggleModal = () => {
    if (!modalOpen) {
      shopify?.modal?.show?.("chart-modal");
    } else {
      shopify?.modal?.hide?.("chart-modal");
    }
    setModalOpen(!modalOpen);
  };

  const timeRanges = ["Day", "Week", "Month"];

  const handleSelect = (value: string) => {
    setSelectedRange(value);
  };

  useEffect(() => {
    const filteredData = chartData?.filter(
      (item: { range: string }) => item.range === selectedRange,
    );
    setFilteredChartData(filteredData);
  }, [chartData, selectedRange]);

  return (
    <>
      <Button onClick={toggleModal}>View Chart</Button>
      <AppBridgeModal open={modalOpen} id="chart-modal">
        <TitleBar title="Page views"></TitleBar>
        <div style={{ padding: 20 }}>
          <TitleBar title="Page Views">
            <Button onClick={() => shopify.modal.hide("chart-modal")}>
              Close
            </Button>
          </TitleBar>
          <Grid columns={{ xs: 2, sm: 2 }}>
            <Grid.Cell>
              <Text variant="headingMd" as="h2" fontWeight="semibold">
                Page views statistics
              </Text>
            </Grid.Cell>
            <Grid.Cell>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  position: "relative",
                }}
              >
                <CustomSelect
                  selected={selectedRange}
                  onChange={handleSelect}
                  options={timeRanges}
                />
              </div>
            </Grid.Cell>
          </Grid>

          <div style={{ padding: "20px 0" }}>
            <Grid columns={{ xs: 1, sm: 3, md: 3 }}>
              <Grid.Cell>{statCard("Index", 500, -2, "page")}</Grid.Cell>
              <Grid.Cell>{statCard("Product", 0, 0, "pages")}</Grid.Cell>
              <Grid.Cell>{statCard("Cart", 100, 2, "pages")}</Grid.Cell>
            </Grid>
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
        </div>
      </AppBridgeModal>
    </>
  );
}
