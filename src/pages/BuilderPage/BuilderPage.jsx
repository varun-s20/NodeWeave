import { Box, LogOut, Settings, User2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import "./BuilderPage.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/workflow/Sidebar";
import Canvas from "../../components/workflow/Canvas";

const BuilderPage = () => {
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("workflow-nodes");
    localStorage.removeItem("workflow-connections");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsLogoutModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const canvasRef = useRef(null);

  const handleAddNode = () => {
    if (canvasRef.current) {
      canvasRef.current.addNode("Webhook"); 
    }
  };

  return (
    <div className="builder-layout">
      <header className="builder-header">
        <div className="header-left" onClick={() => navigate("/builder")}>
          <div className="logo-icon">
            <Box size={24} color="white" />
          </div>
          <span className="header-title">NodeWeave</span>
        </div>
        <div className="header-right">
          <button className="icon-btn">
            <Settings size={20} />{" "}
          </button>
          <div className="avatar-wrapper">
            <div
              className="user-avatar"
              ref={avatarRef}
              onClick={() => {
                setIsLogoutModalOpen(!isLogoutModalOpen);
              }}
            >
              <User2 size={20} />
            </div>
            {isLogoutModalOpen && (
              <div className="logout-dropdown" ref={dropdownRef}>
                <button onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="builder-body">
        <Sidebar onAddNode={handleAddNode} />

        <main className="builder-canvas-area">
          <Canvas ref={canvasRef} />
        </main>
      </main>
    </div>
  );
};

export default BuilderPage;
