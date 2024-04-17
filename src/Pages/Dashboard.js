import React, { useEffect, useRef } from "react";
import classes from "./Dashboard.module.css";
import { Container } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Chart from "chart.js/auto";

const CARD_CONTENT = [
  {
    title: "Monthly Budget",
    price: "11,000.00",
    graph: "",
  },
  {
    title: "Budget Limit",
    price: "10,000.00",
    graph: "",
  },
  {
    title: "Total Balance",
    price: "12,000.00",
    graph: "",
  },
];

const SUMMARY_CONTENT = [
  {
    title: "Total Monthly Budget",
    price: "9000.00",
  },
  {
    title: "Total Monthly Budget Limit",
    price: "10000.00",
  },
  {
    title: "Total Monthly Balance",
    price: "7245.04",
  },
];

const Card = (props) => {
  const { title, price, graph } = props;
  return (
    <li>
      <div>
        <p>{title}</p>
        <EditNoteIcon />
      </div>
      <h1>{price}</h1>
      <div>{graph}</div>
    </li>
  );
};

function Dashboard(props) {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["2013", "2014", "2015", "2016", "2017"],
        datasets: [
          {
            data: [10, 9, 3, 5, 2],
            borderColor: "rgba(252, 3, 73)",
            backgroundColor: "rgba(252, 3, 73)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, mb: 4, padding: 0, fontFamily: "Mulish-Regular" }}
    >
      <section className={classes.sort}>
        <p>Sort by Date</p>
        <p>Refresh</p>
      </section>

      <section className={classes.analyticsHeader}>
        <p>Analytics</p>
        <p>March 2024</p>
      </section>

      <ul className={classes.cardList}>
        {CARD_CONTENT.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </ul>

      <section className={classes.chartSummary}>
        <div>
          <h1>Line Chart</h1>
          <canvas ref={chartRef} height="200" width="800"></canvas>
        </div>
        <div>
          <h1>Summary</h1>
          <p>March 2024</p>
          <ul>
            {SUMMARY_CONTENT.map((summary, index) => (
              <li key={index}>
                <p>{summary.title}</p>
                <p>{summary.price}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Container>
  );
}

export default Dashboard;
