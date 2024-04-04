import Layout from "./Components/Welcome/Layout";

const WelcomePage = () => {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        backgroundColor: "#fff",
        height: "1024px",
        overflow: "hidden",
        textAlign: "left",
        fontSize: "24px",
        color: "#4a99d3",
        fontFamily: "Mulish", // Set font family to Mulish
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "1440px",
          height: "1024px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "1024px",
            left: "1440px",
            background:
              "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff",
            boxShadow: "0px 4px 16px rgba(75, 0, 129, 0.26)",
            width: "1440px",
            height: "1024px",
            transform: " rotate(-180deg)",
            transformOrigin: "0 0",
            opacity: "0.2",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: "300px", // Adjusted top position for the description text
          left: "680px",
          width: "689px",
          height: "360px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            fontSize: "56px",
            fontWeight: "500",
            display: "inline-block",
            width: "689px",
            height: "262px",
          }}
        >
          PrinciPal: Streamlined Public School Document Management System
        </div>
        <div
          style={{
            position: "absolute",
            top: "282px", // Adjusted top position for the description text
            left: "0px",
            lineHeight: "140.63%",
            display: "inline-block",
            width: "670px",
            height: "135px",
          }}
        >
          The pinnacle of innovation in public school document management. Step
          into a realm where efficiency, organization, and productivity converge
          to redefine how educational institutions handle their vital paperwork.
        </div>
      </div>
      <Layout />
      <img
        style={{
          position: "absolute",
          top: "90px",
          left: "149px",
          width: "243px",
          height: "185px",
          objectFit: "cover",
        }}
        alt=""
        src="/logoremovebgpreview-1@2x.png"
      />
    </div>
  );
};

export default WelcomePage;
