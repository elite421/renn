"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import "./admin.css";
import { SiteContent, DEFAULT_SITE_CONTENT, ProductItem, ProcessItem, CapabilityItem, MetricItem, NavItem } from "../lib/contentTypes";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Content state
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [activeTab, setActiveTab] = useState<"general" | "home" | "about" | "products" | "process" | "contact" | "media">("home");
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
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        callback(data.url);
        setIsDirty(true);
        showToast("Image uploaded successfully!");
      } else {
        showToast("Image upload failed.");
      }
    } catch {
      showToast("Error uploading image.");
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
