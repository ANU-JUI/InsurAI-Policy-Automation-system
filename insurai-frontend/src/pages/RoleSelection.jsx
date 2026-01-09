import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUserTie,
  FaUserShield,
  FaUserCog,
  FaHandshake,
} from "react-icons/fa";

export default function RoleSelection() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.background =
      "radial-gradient(circle at top, #6b0f7c 0%, #2b0938 60%, #16051d 100%)";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  const roles = [
    {
      title: "Employee",
      description: "Submit and track insurance claims",
      color: "linear-gradient(135deg, #2563eb, #3b82f6)",
      route: "/employee/login",
      icon: <FaUserTie size={28} />,
    },
    {
      title: "Admin",
      description: "Manage users, policies and system",
      color: "linear-gradient(135deg, #7c3aed, #a855f7)",
      route: "/admin/login",
      icon: <FaUserShield size={28} />,
    },
    {
      title: "HR",
      description: "Verify claims and manage employees",
      color: "linear-gradient(135deg, #059669, #10b981)",
      route: "/hr/login",
      icon: <FaUserCog size={28} />,
    },
    {
      title: "Agent",
      description: "Assist customers and handle queries",
      color: "linear-gradient(135deg, #f97316, #fb923c)",
      route: "/agent/login",
      icon: <FaHandshake size={28} />,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        padding: "3rem 3rem",
        color: "white",
        boxSizing: "border-box",
      }}
    >
      {/* ===== Heading ===== */}
      <div className="text-center mb-5">
        <h1
          style={{
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            marginBottom: "1.2rem",
          }}
        >
          Select Your Role
        </h1>
        <p style={{ opacity: 0.85 }}>
          Choose how you want to access the InsurAI system
        </p>
      </div>

      {/* ===== FORCE FULL WIDTH GRID ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2rem",
          width: "100%",
        }}
      >
        {roles.map((role, index) => (
          <div
            key={role.title}
            onClick={() => navigate(role.route)}
            style={{
              borderRadius: "22px",
              padding: "2.2rem 1.8rem",
              cursor: "pointer",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.15)",
              textAlign: "center",
              transition: "all 0.35s ease",
              animation: "fadeUp 0.6s ease forwards",
              animationDelay: `${index * 0.5}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-10px) scale(1.03)";
              e.currentTarget.style.boxShadow =
                "0 25px 60px rgba(0,0,0,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.25)";
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: role.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.2rem",
                boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
              }}
            >
              {role.icon}
            </div>

            <h4 style={{ fontWeight: 700 }}>{role.title}</h4>

            <p style={{ opacity: 0.85 }}>{role.description}</p>

            <div
              style={{
                marginTop: "1.4rem",
                display: "inline-block",
                padding: "8px 22px",
                borderRadius: "999px",
                background: role.color,
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Continue →
            </div>
          </div>
        ))}
      </div>

      {/* ===== Back Button ===== */}
      <div className="text-center mt-5">
        <button
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.4)",
            color: "white",
            padding: "10px 26px",
            borderRadius: "999px",
          }}
        >
          ← Back to Home
        </button>
      </div>

      <style>
        {`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 992px) {
            div[style*="grid-template-columns"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }

          @media (max-width: 576px) {
            div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}
