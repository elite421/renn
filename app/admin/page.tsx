"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import "./admin.css";
import { SiteContent, DEFAULT_SITE_CONTENT, ProductItem, ProcessItem, CapabilityItem, MetricItem, NavItem } from "../lib/contentTypes";
import { THEME_TEMPLATES, applyThemeTemplate } from "../lib/themeTemplates";

// Simple base64 encoding/decoding for browser
const base64Encode = (str: string): string => {
  try {
    return btoa(str);
  } catch (e) {
    // Fallback for Unicode strings
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      (match, p1) => String.fromCharCode(parseInt(p1, 16))));
  }
};

const base64Decode = (str: string): string => {
  try {
    return atob(str);
  } catch (e) {
    // Fallback for Unicode strings
    return decodeURIComponent(atob(str).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
  }
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Content state
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [activeTab, setActiveTab] = useState<"general" | "home" | "about" | "products" | "process" | "contact" | "theme" | "storage" | "media">("home");
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [toastMsg, setToastMsg] = useState("");

  // Upload state helper
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    fetchAuth();
  }, []);

  const fetchAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
      if (data.authenticated) {
        fetchContent();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      setContent(data);
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to load content", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchContent();
      } else {
        setLoginError(data.error || "Invalid password");
      }
    } catch {
      setLoginError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        setSaveStatus("saved");
        setIsDirty(false);
        showToast("All changes saved successfully!");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        showToast("Failed to save changes.");
      }
    } catch {
      setSaveStatus("error");
      showToast("Error connecting to server.");
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure you want to reset all website text and pictures back to default values?")) {
      try {
        const res = await fetch("/api/admin/reset", { method: "POST" });
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
          setIsDirty(false);
          showToast("Website content restored to default.");
        }
      } catch {
        showToast("Error resetting content.");
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  // Helper to handle image uploads inline
  const uploadImage = async (file: File, callback: (url: string) => void) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      showToast("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      showToast("File size must be less than 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      showToast("Uploading image...");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        showToast(data.error || "Image upload failed.");
        return;
      }
      
      if (data.url) {
        callback(data.url);
        setIsDirty(true);
        showToast("Image uploaded successfully!");
      } else {
        showToast("Image upload failed - no URL returned.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Error uploading image. Please try again.");
    }
  };

  // Content state updater helper
  const updateState = (path: string[], value: any) => {
    setContent((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      let current = clone;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return clone;
    });
    setIsDirty(true);
  };

  if (isAuthenticated === null) {
    return (
      <div className="admin-container admin-login-wrapper">
        <div style={{ color: "#78ad25", fontSize: "18px", fontWeight: "600" }}>Loading Admin Panel...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-container admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-badge">RENN Admin System</div>
          <h1>Website Content Manager</h1>
          <p>Enter the administrator password to edit all website text, headings, and pictures.</p>

          {loginError && <div className="admin-alert-error">{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="admin-field">
              <label htmlFor="admin-pass">Admin Password</label>
              <input
                id="admin-pass"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-full" disabled={isSubmitting}>
              {isSubmitting ? "Authenticating..." : "Login to Admin Panel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {toastMsg && <div className="admin-toast">{toastMsg}</div>}

      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header-title">
          <h2>RENN Admin Control Panel</h2>
          <span className="admin-tag">CMS Enabled</span>
        </div>
        <div className="admin-header-actions">
          <Link href="/" target="_blank" className="admin-btn admin-btn-secondary">
            🌐 Live Website Preview
          </Link>
          <button onClick={handleReset} className="admin-btn admin-btn-danger" title="Reset all texts and pictures to default">
            ↺ Reset Defaults
          </button>
          <button onClick={handleLogout} className="admin-btn admin-btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
          🏠 Home Page
        </button>
        <button className={`admin-tab ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
          📦 Products Catalog
        </button>
        <button className={`admin-tab ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>
          ℹ️ About Page
        </button>
        <button className={`admin-tab ${activeTab === "process" ? "active" : ""}`} onClick={() => setActiveTab("process")}>
          ⚙️ Process Page
        </button>
        <button className={`admin-tab ${activeTab === "contact" ? "active" : ""}`} onClick={() => setActiveTab("contact")}>
          📞 Contact & Form
        </button>
        <button className={`admin-tab ${activeTab === "general" ? "active" : ""}`} onClick={() => setActiveTab("general")}>
          🌐 Header, Footer & Contact Info
        </button>
        <button className={`admin-tab ${activeTab === "theme" ? "active" : ""}`} onClick={() => setActiveTab("theme")}>
          🎨 Theme Settings
        </button>
        <button className={`admin-tab ${activeTab === "storage" ? "active" : ""}`} onClick={() => setActiveTab("storage")}>
          💾 Storage Settings
        </button>
      </div>

      {/* Main Form Body */}
      <main className="admin-main">
        {/* ==================== HOME PAGE TAB ==================== */}
        {activeTab === "home" && (
          <div>
            <div className="admin-section-card">
              <h3>Hero Section</h3>
              <p className="subtitle">Edit main banner title, kicker, paragraph, images and call-to-action buttons.</p>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Hero Kicker</label>
                  <input
                    type="text"
                    value={content.home.heroKicker}
                    onChange={(e) => updateState(["home", "heroKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>SEO Meta Slogan</label>
                  <input
                    type="text"
                    value={content.home.metaSlogan}
                    onChange={(e) => updateState(["home", "metaSlogan"], e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Main Hero Title (H1)</label>
                <input
                  type="text"
                  value={content.home.heroTitle}
                  onChange={(e) => updateState(["home", "heroTitle"], e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Hero Description</label>
                <textarea
                  rows={3}
                  value={content.home.heroDescription}
                  onChange={(e) => updateState(["home", "heroDescription"], e.target.value)}
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Primary Button Text</label>
                  <input
                    type="text"
                    value={content.home.heroBtnPrimaryText}
                    onChange={(e) => updateState(["home", "heroBtnPrimaryText"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Secondary Button Text</label>
                  <input
                    type="text"
                    value={content.home.heroBtnSecondaryText}
                    onChange={(e) => updateState(["home", "heroBtnSecondaryText"], e.target.value)}
                  />
                </div>
              </div>

              {/* Hero Images */}
              <h4 style={{ color: "#a3e635", marginTop: "20px", marginBottom: "12px" }}>Hero Pictures</h4>
              <div className="admin-grid-3">
                {/* Main Hero Image */}
                <div className="admin-field">
                  <label>Main Showcase Picture</label>
                  <div className="admin-image-picker">
                    <div className="admin-image-preview">
                      <img src={content.home.heroMainImage} alt="Preview" />
                    </div>
                    <div className="admin-image-controls">
                      <input
                        type="text"
                        value={content.home.heroMainImage}
                        onChange={(e) => updateState(["home", "heroMainImage"], e.target.value)}
                      />
                      <label className="admin-upload-btn-label">
                        📁 Upload Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              uploadImage(e.target.files[0], (url) => updateState(["home", "heroMainImage"], url));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Top Small Image */}
                <div className="admin-field">
                  <label>Small Top Picture</label>
                  <div className="admin-image-picker">
                    <div className="admin-image-preview">
                      <img src={content.home.heroTopImage} alt="Preview" />
                    </div>
                    <div className="admin-image-controls">
                      <input
                        type="text"
                        value={content.home.heroTopImage}
                        onChange={(e) => updateState(["home", "heroTopImage"], e.target.value)}
                      />
                      <label className="admin-upload-btn-label">
                        📁 Upload Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              uploadImage(e.target.files[0], (url) => updateState(["home", "heroTopImage"], url));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bottom Small Image */}
                <div className="admin-field">
                  <label>Small Bottom Picture</label>
                  <div className="admin-image-picker">
                    <div className="admin-image-preview">
                      <img src={content.home.heroBottomImage} alt="Preview" />
                    </div>
                    <div className="admin-image-controls">
                      <input
                        type="text"
                        value={content.home.heroBottomImage}
                        onChange={(e) => updateState(["home", "heroBottomImage"], e.target.value)}
                      />
                      <label className="admin-upload-btn-label">
                        📁 Upload Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              uploadImage(e.target.files[0], (url) => updateState(["home", "heroBottomImage"], url));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Strip */}
            <div className="admin-section-card">
              <h3>Metrics Strip</h3>
              <p className="subtitle">Key stats and highlight counters shown below hero banner.</p>
              <div className="admin-array-list">
                {content.home.metrics.map((metric, idx) => (
                  <div key={idx} className="admin-grid-2" style={{ background: "#09120c", padding: "12px", borderRadius: "8px" }}>
                    <div className="admin-field" style={{ margin: 0 }}>
                      <label>Metric Value (e.g. 6+)</label>
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const updated = [...content.home.metrics];
                          updated[idx].value = e.target.value;
                          updateState(["home", "metrics"], updated);
                        }}
                      />
                    </div>
                    <div className="admin-field" style={{ margin: 0 }}>
                      <label>Metric Label</label>
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => {
                          const updated = [...content.home.metrics];
                          updated[idx].label = e.target.value;
                          updateState(["home", "metrics"], updated);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section on Home */}
            <div className="admin-section-card">
              <h3>Home - About Panel</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Section Kicker</label>
                  <input
                    type="text"
                    value={content.home.aboutKicker}
                    onChange={(e) => updateState(["home", "aboutKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Read More Link Text</label>
                  <input
                    type="text"
                    value={content.home.aboutReadMoreText}
                    onChange={(e) => updateState(["home", "aboutReadMoreText"], e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Heading</label>
                <input
                  type="text"
                  value={content.home.aboutTitle}
                  onChange={(e) => updateState(["home", "aboutTitle"], e.target.value)}
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Paragraph 1</label>
                  <textarea
                    rows={3}
                    value={content.home.aboutParagraph1}
                    onChange={(e) => updateState(["home", "aboutParagraph1"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Paragraph 2</label>
                  <textarea
                    rows={3}
                    value={content.home.aboutParagraph2}
                    onChange={(e) => updateState(["home", "aboutParagraph2"], e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>About Picture</label>
                <div className="admin-image-picker">
                  <div className="admin-image-preview">
                    <img src={content.home.aboutImage} alt="Preview" />
                  </div>
                  <div className="admin-image-controls">
                    <input
                      type="text"
                      value={content.home.aboutImage}
                      onChange={(e) => updateState(["home", "aboutImage"], e.target.value)}
                    />
                    <label className="admin-upload-btn-label">
                      📁 Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadImage(e.target.files[0], (url) => updateState(["home", "aboutImage"], url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <h4 style={{ color: "#a3e635", marginTop: "20px", marginBottom: "12px" }}>Capabilities List</h4>
              <div className="admin-array-list">
                {content.home.capabilities.map((cap, idx) => (
                  <div key={idx} className="admin-array-item">
                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>Title</label>
                        <input
                          type="text"
                          value={cap.title}
                          onChange={(e) => {
                            const updated = [...content.home.capabilities];
                            updated[idx].title = e.target.value;
                            updateState(["home", "capabilities"], updated);
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Description</label>
                        <textarea
                          rows={2}
                          value={cap.text}
                          onChange={(e) => {
                            const updated = [...content.home.capabilities];
                            updated[idx].text = e.target.value;
                            updateState(["home", "capabilities"], updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Packaging Band */}
            <div className="admin-section-card">
              <h3>Home - Custom Packaging Section</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Section Kicker</label>
                  <input
                    type="text"
                    value={content.home.packagingKicker}
                    onChange={(e) => updateState(["home", "packagingKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Link Text</label>
                  <input
                    type="text"
                    value={content.home.packagingLinkText}
                    onChange={(e) => updateState(["home", "packagingLinkText"], e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>Heading</label>
                <input
                  type="text"
                  value={content.home.packagingTitle}
                  onChange={(e) => updateState(["home", "packagingTitle"], e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Description</label>
                <textarea
                  rows={2}
                  value={content.home.packagingDescription}
                  onChange={(e) => updateState(["home", "packagingDescription"], e.target.value)}
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Packaging Image 1</label>
                  <div className="admin-image-picker">
                    <div className="admin-image-preview">
                      <img src={content.home.packagingImage1} alt="Preview" />
                    </div>
                    <div className="admin-image-controls">
                      <input
                        type="text"
                        value={content.home.packagingImage1}
                        onChange={(e) => updateState(["home", "packagingImage1"], e.target.value)}
                      />
                      <label className="admin-upload-btn-label">
                        📁 Upload Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              uploadImage(e.target.files[0], (url) => updateState(["home", "packagingImage1"], url));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-field">
                  <label>Packaging Image 2</label>
                  <div className="admin-image-picker">
                    <div className="admin-image-preview">
                      <img src={content.home.packagingImage2} alt="Preview" />
                    </div>
                    <div className="admin-image-controls">
                      <input
                        type="text"
                        value={content.home.packagingImage2}
                        onChange={(e) => updateState(["home", "packagingImage2"], e.target.value)}
                      />
                      <label className="admin-upload-btn-label">
                        📁 Upload Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              uploadImage(e.target.files[0], (url) => updateState(["home", "packagingImage2"], url));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sectors Served List */}
            <div className="admin-section-card">
              <h3>Markets / Sectors Served</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Section Kicker</label>
                  <input
                    type="text"
                    value={content.home.sectorsKicker}
                    onChange={(e) => updateState(["home", "sectorsKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Heading</label>
                  <input
                    type="text"
                    value={content.home.sectorsTitle}
                    onChange={(e) => updateState(["home", "sectorsTitle"], e.target.value)}
                  />
                </div>
              </div>

              <label style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1", display: "block", marginBottom: "8px" }}>
                Sector Badges (Comma-separated)
              </label>
              <input
                type="text"
                value={content.home.sectors.join(", ")}
                onChange={(e) => {
                  const arr = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                  updateState(["home", "sectors"], arr);
                }}
              />
            </div>
          </div>
        )}

        {/* ==================== PRODUCTS CATALOG TAB ==================== */}
        {activeTab === "products" && (
          <div>
            <div className="admin-section-card">
              <h3>Products Page Header</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Hero Kicker</label>
                  <input
                    type="text"
                    value={content.productsPage.heroKicker}
                    onChange={(e) => updateState(["productsPage", "heroKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Hero Title</label>
                  <input
                    type="text"
                    value={content.productsPage.heroTitle}
                    onChange={(e) => updateState(["productsPage", "heroTitle"], e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>Hero Description</label>
                <textarea
                  rows={2}
                  value={content.productsPage.heroText}
                  onChange={(e) => updateState(["productsPage", "heroText"], e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Hero Showcase Picture</label>
                <div className="admin-image-picker">
                  <div className="admin-image-preview">
                    <img src={content.productsPage.heroImage} alt="Preview" />
                  </div>
                  <div className="admin-image-controls">
                    <input
                      type="text"
                      value={content.productsPage.heroImage}
                      onChange={(e) => updateState(["productsPage", "heroImage"], e.target.value)}
                    />
                    <label className="admin-upload-btn-label">
                      📁 Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadImage(e.target.files[0], (url) => updateState(["productsPage", "heroImage"], url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Items List */}
            <div className="admin-section-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ margin: 0 }}>Product Items ({content.products.length})</h3>
                  <p className="subtitle" style={{ margin: 0 }}>Manage product title, text, image, highlights, and specifications.</p>
                </div>
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    const newProd: ProductItem = {
                      slug: `new-product-${Date.now()}`,
                      title: "New Hygiene Product",
                      eyebrow: "Category / Sector",
                      text: "Detailed description of the new product...",
                      image: "/images/napkins.png",
                      highlights: ["High quality", "Soft finish"],
                      specs: ["Bulk supply", "Custom packs"]
                    };
                    updateState(["products"], [...content.products, newProd]);
                  }}
                >
                  + Add New Product
                </button>
              </div>

              <div className="admin-array-list">
                {content.products.map((prod, idx) => (
                  <div key={idx} className="admin-array-item">
                    <div className="admin-array-item-header">
                      <h4>
                        #{idx + 1} - {prod.title} <span style={{ fontSize: "12px", color: "#94a3b8" }}>({prod.slug})</span>
                      </h4>
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                        onClick={() => {
                          if (confirm(`Delete product "${prod.title}"?`)) {
                            const updated = content.products.filter((_, i) => i !== idx);
                            updateState(["products"], updated);
                          }
                        }}
                      >
                        Delete Product
                      </button>
                    </div>

                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>Product Title</label>
                        <input
                          type="text"
                          value={prod.title}
                          onChange={(e) => {
                            const updated = [...content.products];
                            updated[idx].title = e.target.value;
                            updateState(["products"], updated);
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Eyebrow / Subcategory</label>
                        <input
                          type="text"
                          value={prod.eyebrow}
                          onChange={(e) => {
                            const updated = [...content.products];
                            updated[idx].eyebrow = e.target.value;
                            updateState(["products"], updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="admin-field">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={prod.text}
                        onChange={(e) => {
                          const updated = [...content.products];
                          updated[idx].text = e.target.value;
                          updateState(["products"], updated);
                        }}
                      />
                    </div>

                    {/* Product Picture */}
                    <div className="admin-field">
                      <label>Product Picture</label>
                      <div className="admin-image-picker">
                        <div className="admin-image-preview">
                          <img src={prod.image} alt={prod.title} />
                        </div>
                        <div className="admin-image-controls">
                          <input
                            type="text"
                            value={prod.image}
                            onChange={(e) => {
                              const updated = [...content.products];
                              updated[idx].image = e.target.value;
                              updateState(["products"], updated);
                            }}
                          />
                          <label className="admin-upload-btn-label">
                            📁 Upload Picture
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  uploadImage(e.target.files[0], (url) => {
                                    const updated = [...content.products];
                                    updated[idx].image = url;
                                    updateState(["products"], updated);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="admin-grid-2">
                      <div className="admin-field">
                        <label>Highlights (Comma-separated)</label>
                        <input
                          type="text"
                          value={prod.highlights.join(", ")}
                          onChange={(e) => {
                            const updated = [...content.products];
                            updated[idx].highlights = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            updateState(["products"], updated);
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Specifications (Comma-separated)</label>
                        <input
                          type="text"
                          value={prod.specs.join(", ")}
                          onChange={(e) => {
                            const updated = [...content.products];
                            updated[idx].specs = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                            updateState(["products"], updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== ABOUT PAGE TAB ==================== */}
        {activeTab === "about" && (
          <div>
            <div className="admin-section-card">
              <h3>About Page Hero & Story</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Hero Kicker</label>
                  <input
                    type="text"
                    value={content.about.heroKicker}
                    onChange={(e) => updateState(["about", "heroKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Hero Title</label>
                  <input
                    type="text"
                    value={content.about.heroTitle}
                    onChange={(e) => updateState(["about", "heroTitle"], e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>Hero Paragraph</label>
                <textarea
                  rows={2}
                  value={content.about.heroText}
                  onChange={(e) => updateState(["about", "heroText"], e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Hero Picture</label>
                <div className="admin-image-picker">
                  <div className="admin-image-preview">
                    <img src={content.about.heroImage} alt="Preview" />
                  </div>
                  <div className="admin-image-controls">
                    <input
                      type="text"
                      value={content.about.heroImage}
                      onChange={(e) => updateState(["about", "heroImage"], e.target.value)}
                    />
                    <label className="admin-upload-btn-label">
                      📁 Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadImage(e.target.files[0], (url) => updateState(["about", "heroImage"], url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h3>Our Direction Section</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Direction Kicker</label>
                  <input
                    type="text"
                    value={content.about.directionKicker}
                    onChange={(e) => updateState(["about", "directionKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Direction Heading</label>
                  <input
                    type="text"
                    value={content.about.directionHeading}
                    onChange={(e) => updateState(["about", "directionHeading"], e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Paragraph 1</label>
                  <textarea
                    rows={3}
                    value={content.about.directionParagraph1}
                    onChange={(e) => updateState(["about", "directionParagraph1"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Paragraph 2</label>
                  <textarea
                    rows={3}
                    value={content.about.directionParagraph2}
                    onChange={(e) => updateState(["about", "directionParagraph2"], e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label>Operations Picture</label>
                <div className="admin-image-picker">
                  <div className="admin-image-preview">
                    <img src={content.about.operationsImage} alt="Preview" />
                  </div>
                  <div className="admin-image-controls">
                    <input
                      type="text"
                      value={content.about.operationsImage}
                      onChange={(e) => updateState(["about", "operationsImage"], e.target.value)}
                    />
                    <label className="admin-upload-btn-label">
                      📁 Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadImage(e.target.files[0], (url) => updateState(["about", "operationsImage"], url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== PROCESS PAGE TAB ==================== */}
        {activeTab === "process" && (
          <div>
            <div className="admin-section-card">
              <h3>Process Page Hero</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Hero Kicker</label>
                  <input
                    type="text"
                    value={content.processPage.heroKicker}
                    onChange={(e) => updateState(["processPage", "heroKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Hero Title</label>
                  <input
                    type="text"
                    value={content.processPage.heroTitle}
                    onChange={(e) => updateState(["processPage", "heroTitle"], e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>Hero Description</label>
                <textarea
                  rows={2}
                  value={content.processPage.heroText}
                  onChange={(e) => updateState(["processPage", "heroText"], e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label>Hero Picture</label>
                <div className="admin-image-picker">
                  <div className="admin-image-preview">
                    <img src={content.processPage.heroImage} alt="Preview" />
                  </div>
                  <div className="admin-image-controls">
                    <input
                      type="text"
                      value={content.processPage.heroImage}
                      onChange={(e) => updateState(["processPage", "heroImage"], e.target.value)}
                    />
                    <label className="admin-upload-btn-label">
                      📁 Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadImage(e.target.files[0], (url) => updateState(["processPage", "heroImage"], url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Timeline Steps */}
            <div className="admin-section-card">
              <h3>Process Steps Timeline</h3>
              <div className="admin-array-list">
                {content.processSteps.map((step, idx) => (
                  <div key={idx} className="admin-array-item">
                    <div className="admin-grid-3">
                      <div className="admin-field">
                        <label>Step Number (e.g. 01)</label>
                        <input
                          type="text"
                          value={step.number}
                          onChange={(e) => {
                            const updated = [...content.processSteps];
                            updated[idx].number = e.target.value;
                            updateState(["processSteps"], updated);
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Step Title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updated = [...content.processSteps];
                            updated[idx].title = e.target.value;
                            updateState(["processSteps"], updated);
                          }}
                        />
                      </div>
                      <div className="admin-field">
                        <label>Description</label>
                        <input
                          type="text"
                          value={step.text}
                          onChange={(e) => {
                            const updated = [...content.processSteps];
                            updated[idx].text = e.target.value;
                            updateState(["processSteps"], updated);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== CONTACT PAGE TAB ==================== */}
        {activeTab === "contact" && (
          <div>
            <div className="admin-section-card">
              <h3>Contact Page Hero</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Hero Kicker</label>
                  <input
                    type="text"
                    value={content.contactPage.heroKicker}
                    onChange={(e) => updateState(["contactPage", "heroKicker"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Hero Title</label>
                  <input
                    type="text"
                    value={content.contactPage.heroTitle}
                    onChange={(e) => updateState(["contactPage", "heroTitle"], e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>Hero Paragraph</label>
                <textarea
                  rows={2}
                  value={content.contactPage.heroText}
                  onChange={(e) => updateState(["contactPage", "heroText"], e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Hero Picture</label>
                <div className="admin-image-picker">
                  <div className="admin-image-preview">
                    <img src={content.contactPage.heroImage} alt="Preview" />
                  </div>
                  <div className="admin-image-controls">
                    <input
                      type="text"
                      value={content.contactPage.heroImage}
                      onChange={(e) => updateState(["contactPage", "heroImage"], e.target.value)}
                    />
                    <label className="admin-upload-btn-label">
                      📁 Upload Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadImage(e.target.files[0], (url) => updateState(["contactPage", "heroImage"], url));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h3>Contact Form Texts</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Form Title</label>
                  <input
                    type="text"
                    value={content.contactPage.formTitle}
                    onChange={(e) => updateState(["contactPage", "formTitle"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Submit Button Text</label>
                  <input
                    type="text"
                    value={content.contactPage.formSubmitText}
                    onChange={(e) => updateState(["contactPage", "formSubmitText"], e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label>Form Subheading</label>
                <input
                  type="text"
                  value={content.contactPage.formSubheading}
                  onChange={(e) => updateState(["contactPage", "formSubheading"], e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Success Message Text</label>
                <textarea
                  rows={2}
                  value={content.contactPage.formSuccessMsg}
                  onChange={(e) => updateState(["contactPage", "formSuccessMsg"], e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================== HEADER, FOOTER & CONTACT INFO TAB ==================== */}
        {activeTab === "general" && (
          <div>
            <div className="admin-section-card">
              <h3>Branding & Navigation</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Brand Mark ("RENN")</label>
                  <input
                    type="text"
                    value={content.header.brandMark}
                    onChange={(e) => updateState(["header", "brandMark"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Brand Subtitle ("Products LLP")</label>
                  <input
                    type="text"
                    value={content.header.brandSub}
                    onChange={(e) => updateState(["header", "brandSub"], e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Header CTA Button</label>
                  <input
                    type="text"
                    value={content.header.ctaText}
                    onChange={(e) => updateState(["header", "ctaText"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Mobile CTA Button</label>
                  <input
                    type="text"
                    value={content.header.mobileCtaText}
                    onChange={(e) => updateState(["header", "mobileCtaText"], e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h3>Company Contact Information</h3>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Primary Phone</label>
                  <input
                    type="text"
                    value={content.contactInfo.phonePrimary}
                    onChange={(e) => updateState(["contactInfo", "phonePrimary"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Secondary Phone</label>
                  <input
                    type="text"
                    value={content.contactInfo.phoneSecondary}
                    onChange={(e) => updateState(["contactInfo", "phoneSecondary"], e.target.value)}
                  />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={content.contactInfo.email}
                    onChange={(e) => updateState(["contactInfo", "email"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Location / Country</label>
                  <input
                    type="text"
                    value={content.contactInfo.location}
                    onChange={(e) => updateState(["contactInfo", "location"], e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="admin-section-card">
              <h3>Footer Section</h3>
              <div className="admin-field">
                <label>Footer Slogan</label>
                <input
                  type="text"
                  value={content.footer.slogan}
                  onChange={(e) => updateState(["footer", "slogan"], e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>Footer Description</label>
                <textarea
                  rows={2}
                  value={content.footer.description}
                  onChange={(e) => updateState(["footer", "description"], e.target.value)}
                />
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Copyright Line</label>
                  <input
                    type="text"
                    value={content.footer.copyrightText}
                    onChange={(e) => updateState(["footer", "copyrightText"], e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label>Footer CTA Text</label>
                  <input
                    type="text"
                    value={content.footer.ctaText}
                    onChange={(e) => updateState(["footer", "ctaText"], e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== THEME SETTINGS TAB ==================== */}
        {activeTab === "theme" && (
          <div>
            <div className="admin-section-card">
              <h3>Theme Configuration</h3>
              <p className="subtitle">Choose a template or customize your website appearance with advanced controls.</p>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Enable Theme Switching</label>
                  <select
                    value={content.theme.enabled ? "true" : "false"}
                    onChange={(e) => updateState(["theme", "enabled"], e.target.value === "true")}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Default Theme Mode</label>
                  <select
                    value={content.theme.mode}
                    onChange={(e) => updateState(["theme", "mode"], e.target.value as "light" | "dark" | "auto")}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System Preference)</option>
                  </select>
                </div>
              </div>

              <h4 style={{ color: "#a3e635", marginTop: "24px", marginBottom: "16px" }}>🎨 Theme Templates</h4>
              <p style={{ color: "#617064", marginBottom: "16px", fontSize: "14px" }}>Select a pre-designed theme template to instantly change your website's look and feel.</p>
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
                gap: "16px",
                marginBottom: "24px"
              }}>
                {Object.entries(THEME_TEMPLATES).map(([key, template]) => (
                  <div
                    key={key}
                    onClick={() => {
                      const themeSettings = applyThemeTemplate(key);
                      Object.entries(themeSettings).forEach(([settingKey, value]) => {
                        if (value !== undefined) {
                          updateState(["theme", settingKey as any], value);
                        }
                      });
                      showToast(`${template.name} theme applied!`);
                    }}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      border: `2px solid ${content.theme.template === key ? content.theme.primaryColor : "#dce4da"}`,
                      background: content.theme.template === key ? template.colors.cardBackground : "#ffffff",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = template.colors.primaryColor;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = content.theme.template === key ? content.theme.primaryColor : "#dce4da";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>{template.preview}</div>
                    <h5 style={{ 
                      margin: "0 0 4px 0", 
                      color: template.colors.textColor,
                      fontSize: "16px",
                      fontWeight: "700"
                    }}>{template.name}</h5>
                    <p style={{ 
                      margin: 0, 
                      color: template.colors.textColor,
                      opacity: 0.7,
                      fontSize: "12px",
                      lineHeight: "1.4"
                    }}>{template.description}</p>
                    <div style={{ 
                      marginTop: "12px", 
                      display: "flex", 
                      gap: "4px" 
                    }}>
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        borderRadius: "50%", 
                        background: template.colors.primaryColor,
                        border: "1px solid rgba(0,0,0,0.1)"
                      }} />
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        borderRadius: "50%", 
                        background: template.colors.accentColor,
                        border: "1px solid rgba(0,0,0,0.1)"
                      }} />
                      <div style={{ 
                        width: "20px", 
                        height: "20px", 
                        borderRadius: "50%", 
                        background: template.colors.backgroundColor,
                        border: "1px solid rgba(0,0,0,0.1)"
                      }} />
                    </div>
                    {content.theme.template === key && (
                      <div style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: template.colors.primaryColor,
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "bold"
                      }}>
                        Active
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h4 style={{ color: "#a3e635", marginTop: "24px", marginBottom: "16px" }}>🎛️ Advanced Customization</h4>
              <p style={{ color: "#617064", marginBottom: "16px", fontSize: "14px" }}>Fine-tune individual colors and settings for complete control.</p>

              <h5 style={{ color: "#78ad25", marginTop: "16px", marginBottom: "12px" }}>Brand Colors</h5>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Primary Color</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={content.theme.primaryColor}
                      onChange={(e) => updateState(["theme", "primaryColor"], e.target.value)}
                      style={{ width: "60px", height: "40px", padding: "2px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={content.theme.primaryColor}
                      onChange={(e) => updateState(["theme", "primaryColor"], e.target.value)}
                      placeholder="#0d4a36"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label>Accent Color</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={content.theme.accentColor}
                      onChange={(e) => updateState(["theme", "accentColor"], e.target.value)}
                      style={{ width: "60px", height: "40px", padding: "2px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={content.theme.accentColor}
                      onChange={(e) => updateState(["theme", "accentColor"], e.target.value)}
                      placeholder="#78ad25"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <h5 style={{ color: "#78ad25", marginTop: "20px", marginBottom: "12px" }}>Background Colors</h5>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Page Background</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={content.theme.backgroundColor}
                      onChange={(e) => updateState(["theme", "backgroundColor"], e.target.value)}
                      style={{ width: "60px", height: "40px", padding: "2px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={content.theme.backgroundColor}
                      onChange={(e) => updateState(["theme", "backgroundColor"], e.target.value)}
                      placeholder="#fbfaf4"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label>Hero Background</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={content.theme.heroBackground.startsWith('#') ? content.theme.heroBackground : "#ffffff"}
                      onChange={(e) => updateState(["theme", "heroBackground"], e.target.value)}
                      style={{ width: "60px", height: "40px", padding: "2px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={content.theme.heroBackground}
                      onChange={(e) => updateState(["theme", "heroBackground"], e.target.value)}
                      placeholder="gradient or color"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Card Background</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={content.theme.cardBackground.startsWith('#') ? content.theme.cardBackground : "#ffffff"}
                      onChange={(e) => updateState(["theme", "cardBackground"], e.target.value)}
                      style={{ width: "60px", height: "40px", padding: "2px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={content.theme.cardBackground}
                      onChange={(e) => updateState(["theme", "cardBackground"], e.target.value)}
                      placeholder="#ffffff"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label>Section Background</label>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                      type="color"
                      value={content.theme.sectionBackground.startsWith('#') ? content.theme.sectionBackground : "#ffffff"}
                      onChange={(e) => updateState(["theme", "sectionBackground"], e.target.value)}
                      style={{ width: "60px", height: "40px", padding: "2px", cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={content.theme.sectionBackground}
                      onChange={(e) => updateState(["theme", "sectionBackground"], e.target.value)}
                      placeholder="#ffffff"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-field">
                <label>Text Color</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input
                    type="color"
                    value={content.theme.textColor}
                    onChange={(e) => updateState(["theme", "textColor"], e.target.value)}
                    style={{ width: "60px", height: "40px", padding: "2px", cursor: "pointer" }}
                  />
                  <input
                    type="text"
                    value={content.theme.textColor}
                    onChange={(e) => updateState(["theme", "textColor"], e.target.value)}
                    placeholder="#17231c"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              <h5 style={{ color: "#78ad25", marginTop: "20px", marginBottom: "12px" }}>Typography & Design</h5>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Border Radius</label>
                  <select
                    value={content.theme.borderRadius}
                    onChange={(e) => updateState(["theme", "borderRadius"], e.target.value)}
                  >
                    <option value="4px">Small (4px)</option>
                    <option value="8px">Medium (8px)</option>
                    <option value="12px">Large (12px)</option>
                    <option value="16px">Extra Large (16px)</option>
                    <option value="24px">Rounded (24px)</option>
                    <option value="0px">Square (0px)</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>Font Family</label>
                  <select
                    value={content.theme.fontFamily}
                    onChange={(e) => updateState(["theme", "fontFamily"], e.target.value)}
                  >
                    <option value="Inter">Inter (Modern)</option>
                    <option value="Outfit">Outfit (Display)</option>
                    <option value="Arial">Arial (Classic)</option>
                    <option value="Georgia">Georgia (Serif)</option>
                    <option value="system-ui">System UI</option>
                  </select>
                </div>
              </div>

              <div className="admin-field">
                <label>Live Theme Preview</label>
                <div style={{
                  padding: "24px",
                  borderRadius: content.theme.borderRadius,
                  background: content.theme.backgroundColor,
                  border: `2px solid ${content.theme.primaryColor}`,
                  marginTop: "12px",
                  fontFamily: content.theme.fontFamily,
                  color: content.theme.textColor
                }}>
                  <h4 style={{ 
                    marginBottom: "12px",
                    color: content.theme.primaryColor
                  }}>
                    Theme Preview
                  </h4>
                  <p style={{ 
                    marginBottom: "16px",
                    opacity: 0.8,
                    lineHeight: "1.6"
                  }}>
                    This is how your theme will appear on the website. The preview shows your color choices, typography, and spacing settings in real-time.
                  </p>
                  <div style={{ 
                    background: content.theme.cardBackground,
                    padding: "16px",
                    borderRadius: content.theme.borderRadius,
                    marginBottom: "16px",
                    border: "1px solid rgba(0,0,0,0.1)"
                  }}>
                    <strong>Card Example</strong>
                    <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.7 }}>
                      This shows how cards will look with your theme settings.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button style={{
                      background: content.theme.primaryColor,
                      color: "#ffffff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: content.theme.borderRadius,
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontFamily: content.theme.fontFamily
                    }}>
                      Primary Button
                    </button>
                    <button style={{
                      background: content.theme.accentColor,
                      color: "#ffffff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: content.theme.borderRadius,
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontFamily: content.theme.fontFamily
                    }}>
                      Accent Button
                    </button>
                  </div>
                </div>
              </div>

              <div className="admin-field">
                <label>Quick Actions</label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
                  <button 
                    onClick={() => {
                      const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                      updateState(["theme", "primaryColor"], randomColor());
                      updateState(["theme", "accentColor"], randomColor());
                      updateState(["theme", "template"], "custom");
                      showToast("Random colors generated!");
                    }}
                    className="admin-btn admin-btn-secondary"
                  >
                    🎨 Random Colors
                  </button>
                  <button 
                    onClick={() => {
                      updateState(["theme", "template"], "default");
                      const defaultSettings = applyThemeTemplate("default");
                      Object.entries(defaultSettings).forEach(([key, value]) => {
                        if (value !== undefined) {
                          updateState(["theme", key as any], value);
                        }
                      });
                      showToast("Reset to default theme!");
                    }}
                    className="admin-btn admin-btn-secondary"
                  >
                    🔄 Reset to Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STORAGE SETTINGS TAB ==================== */}
        {activeTab === "storage" && (
          <div>
            <div className="admin-section-card">
              <h3>Storage Configuration</h3>
              <p className="subtitle">Configure how your website content is stored and persisted.</p>

              <div className="admin-field">
                <label>Storage Environment</label>
                <div style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "#09120c",
                  border: "1px solid #1a2f24",
                  marginTop: "8px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ 
                      width: "12px", 
                      height: "12px", 
                      borderRadius: "50%", 
                      background: "#78ad25" 
                    }} />
                    <span style={{ color: "#e2e8f0", fontWeight: "600" }}>
                      File System Storage (Local Development)
                    </span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "8px" }}>
                    Content is saved to <code>data/site-content.json</code> file. Works for local development and traditional hosting.
                  </p>
                </div>

                <div style={{
                  padding: "16px",
                  borderRadius: "8px",
                  background: "#09120c",
                  border: "1px solid #1a2f24",
                  marginTop: "12px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ 
                      width: "12px", 
                      height: "12px", 
                      borderRadius: "50%", 
                      background: "#f97316" 
                    }} />
                    <span style={{ color: "#e2e8f0", fontWeight: "600" }}>
                      Serverless Storage (Vercel/AWS Lambda)
                    </span>
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "8px" }}>
                    File system is read-only. Content changes won't persist between deployments. 
                    <strong>Current limitation: Changes will be lost on next deployment.</strong>
                  </p>
                </div>
              </div>

              <div className="admin-section-card">
                <h3>Vercel Storage Setup</h3>
                <p className="subtitle">Enable persistent storage for your Vercel deployment.</p>

                <div className="admin-field">
                  <label>Environment Variable Setup</label>
                  <div style={{ 
                    padding: "16px", 
                    borderRadius: "8px", 
                    background: "#1a2f24", 
                    marginTop: "8px",
                    fontFamily: "monospace",
                    fontSize: "13px",
                    color: "#94a3b8"
                  }}>
                    <p style={{ margin: "0 0 12px 0", color: "#78ad25" }}>
                      Step 1: Generate Environment Variable
                    </p>
                    <code style={{ 
                      display: "block", 
                      padding: "8px", 
                      background: "#09120c", 
                      borderRadius: "4px",
                      marginBottom: "12px",
                      color: "#e2e8f0"
                    }}>
                      node -e "console.log(require('./app/lib/vercelStorage').VercelStorage.generateEnvVar())"
                    </code>
                    
                    <p style={{ margin: "0 0 12px 0", color: "#78ad25" }}>
                      Step 2: Add to Vercel Environment Variables
                    </p>
                    <ol style={{ margin: "0 0 12px 0", paddingLeft: "20px", color: "#94a3b8" }}>
                      <li>Go to Vercel Dashboard → Your Project</li>
                      <li>Navigate to Settings → Environment Variables</li>
                      <li>Add variable name: <code>SITE_CONTENT_JSON</code></li>
                      <li>Paste the generated value from Step 1</li>
                      <li>Select the appropriate environment(s)</li>
                      <li>Save and redeploy your application</li>
                    </ol>

                    <p style={{ margin: "0 0 12px 0", color: "#78ad25" }}>
                      Step 3: Verify Setup
                    </p>
                    <button 
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/admin/storage-info");
                          const data = await res.json();
                          if (data.currentEnvValue === "SET") {
                            showToast("✅ Environment variable is configured!");
                          } else {
                            showToast("⚠️ Environment variable not set yet");
                          }
                        } catch {
                          showToast("Error checking storage configuration");
                        }
                      }}
                      className="admin-btn admin-btn-secondary"
                      style={{ marginTop: "8px" }}
                    >
                      Check Storage Configuration
                    </button>
                  </div>
                </div>

                <div className="admin-section-card">
                  <h3>Alternative Storage Solutions</h3>
                  <p className="subtitle">For production use, consider integrating a database.</p>

                  <div style={{ display: "grid", gap: "16px" }}>
                    <div style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "#1a2f24",
                      border: "1px solid #2d4a3a"
                    }}>
                      <h4 style={{ color: "#78ad25", margin: "0 0 8px 0" }}>Vercel Postgres</h4>
                      <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                        Managed PostgreSQL database with automatic backups and scaling. 
                        Recommended for production applications.
                      </p>
                    </div>

                    <div style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "#1a2f24",
                      border: "1px solid #2d4a3a"
                    }}>
                      <h4 style={{ color: "#78ad25", margin: "0 0 8px 0" }}>Supabase</h4>
                      <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                        Open-source Firebase alternative with PostgreSQL database, 
                        real-time subscriptions, and storage.
                      </p>
                    </div>

                    <div style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: "#1a2f24",
                      border: "1px solid #2d4a3a"
                    }}>
                      <h4 style={{ color: "#78ad25", margin: "0 0 8px 0" }}>Vercel KV</h4>
                      <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                        Redis-compatible key-value store for caching and session management.
                        Simple integration for basic storage needs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="admin-section-card">
                  <h3>Current Content Export</h3>
                  <p className="subtitle">Export your current content for backup or manual environment variable setup.</p>

                  <div className="admin-field">
                    <button 
                      onClick={() => {
                        const contentStr = JSON.stringify(content, null, 2);
                        const blob = new Blob([contentStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'site-content-backup.json';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        showToast("Content exported successfully!");
                      }}
                      className="admin-btn admin-btn-primary"
                    >
                      📥 Export Current Content
                    </button>
                  </div>

                  <div className="admin-field">
                    <label>Environment Variable Value</label>
                    <textarea
                      readOnly
                      value={base64Encode(JSON.stringify(content))}
                      style={{
                        width: "100%",
                        minHeight: "120px",
                        padding: "12px",
                        borderRadius: "8px",
                        background: "#09120c",
                        border: "1px solid #1a2f24",
                        color: "#94a3b8",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        marginTop: "8px"
                      }}
                      onClick={(e) => {
                        (e.target as HTMLTextAreaElement).select();
                      }}
                    />
                    <button 
                      onClick={() => {
                        const envValue = base64Encode(JSON.stringify(content));
                        navigator.clipboard.writeText(envValue);
                        showToast("Environment variable copied to clipboard!");
                      }}
                      className="admin-btn admin-btn-secondary"
                      style={{ marginTop: "8px" }}
                    >
                      📋 Copy to Clipboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Save Action Bar */}
      <div className="admin-save-bar">
        <div className="admin-save-status">
          <span className={`admin-status-dot ${isDirty ? "dirty" : ""}`} />
          {isDirty ? "Unsaved changes pending" : "All changes up to date"}
        </div>
        <button
          onClick={handleSave}
          className="admin-btn admin-btn-primary"
          disabled={saveStatus === "saving"}
          style={{ minWidth: "160px" }}
        >
          {saveStatus === "saving" ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
