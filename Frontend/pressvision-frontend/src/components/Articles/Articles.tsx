// src/components/Articles/Articles.tsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ReactSketchCanvas } from "react-sketch-canvas";
import type { ReactSketchCanvasRef } from "react-sketch-canvas";
import type { Article } from "./types";


const Articles: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [openNotes, setOpenNotes] = useState(false);
    const [notesText, setNotesText] = useState<string>("");
    const [id, setArticleId] = useState<number | null>(null); // To track selected article
    const [canvasImg, setCanvasImg] = useState<string>("");
    const [saveMessage, setSaveMessage] = useState<string>("");
    const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
    const [strokeColor, setStrokeColor] = useState<string>("#000000");
    const [strokeWidth, setStrokeWidth] = useState<number>(3);
    const [isErasing, setIsErasing] = useState<boolean>(false);
    const [showToolbox, setShowToolbox] = useState<boolean>(true);
    const [showTextBox, setShowTextBox] = useState<boolean>(false);
    const [textValue, setTextValue] = useState<string>("");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const exportCanvasImage = async (): Promise<string> => {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                setTimeout(async () => {
                    const img = await canvasRef.current?.exportImage("png");
                    resolve(img || "");
                }, 400); // 400 ms ensures image + text are rendered
            });
        });
    };
    const saveNotesToDB = async () => {
        debugger
        try {
            const finalImage = await mergeCanvasWithImage();
            const response = await fetch("http://localhost:5000/notes/save-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    article_id: id,
                    notes_text: notesText,
                    canvas_image: finalImage, // merged sketch + uploaded image
                }),
            });

            const data = await response.json();
            console.log("Save response:", data);

            if (data.success) {
                setSaveMessage("✅ Notes saved successfully!");
            } else {
                setSaveMessage("❌ Failed to save notes");
            }
        } catch (err) {
            console.log(err);
            setSaveMessage("❌ Failed to save notes");
        }
    };
    const mergeCanvasWithImage = async () => {
        const sketchImage = await canvasRef.current?.exportImage("png");
        if (!sketchImage) return "";
        return new Promise<string>((resolve) => {
            const finalCanvas = document.createElement("canvas");
            const ctx = finalCanvas.getContext("2d");
            const img1 = new Image(); // sketch
            const img2 = new Image(); // uploaded image

            img1.onload = () => {
                finalCanvas.width = img1.width;
                finalCanvas.height = img1.height;
                ctx?.drawImage(img1, 0, 0);

                img2.onload = () => {
                    ctx?.drawImage(img2, 0, 0); // place uploaded image on top
                    resolve(finalCanvas.toDataURL("image/png"));
                };

                img2.src = uploadedImage || "";
            };

            img1.src = sketchImage;
        });
    };


    const canvasStyles: React.CSSProperties = {
        border: "2px solid #000",
        borderRadius: "10px",
        width: "100%",
        height: "420px",
        background: "#fff",
    };

    // ✨ TypeScript-safe dynamic function caller
    const callCanvas = async (
        fnName: string,
        ...args: unknown[]
    ): Promise<unknown> => {
        const fn = (canvasRef.current as any)?.[fnName];
        if (typeof fn === "function") {
            return await fn(...args);
        }
    };

    const updateCanvasStroke = () => {
        (canvasRef.current as any)?.setStrokeColor?.(strokeColor);
        (canvasRef.current as any)?.setStrokeWidth?.(strokeWidth);
    };

    const toggleEraser = async (on: boolean) => {
        setIsErasing(on);
        await callCanvas("eraseMode", on);
    };

    const handleAddText = () => {
        setShowTextBox(true);
        setTextValue("");
    };

    // ✨ Now typed
    const escapeXml = (unsafe: string): string =>
        unsafe.replace(/[<>&'"]/g, (c: string) => {
            switch (c) {
                case "<":
                    return "&lt;";
                case ">":
                    return "&gt;";
                case "&":
                    return "&amp;";
                case "'":
                    return "&apos;";
                case '"':
                    return "&quot;";
                default:
                    return c;
            }
        });

    const applyTextToCanvas = async () => {
        if (!textValue.trim()) return setShowTextBox(false);

        const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' width='800' height='120'>
        <style>.t { fill:${strokeColor}; font-family:Arial; font-size:28px; }</style>
        <text x="10" y="40" class="t">${escapeXml(textValue)}</text>
      </svg>
    `;

        const svgBase64 = `data:image/svg+xml;base64,${btoa(svg)}`;

        await callCanvas("addImage", svgBase64);

        setShowTextBox(false);
        setTextValue("");
    };

    const handleImageUpload = (file: File) => {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            setUploadedImage(reader.result as string); // Store base64 temporarily
        };

        reader.readAsDataURL(file);
    };



    useEffect(() => {
        updateCanvasStroke();
    }, [strokeColor, strokeWidth]);



    useEffect(() => {
        axios
            .get("http://localhost:1337/api/articles?populate=*")
            .then((res) => {
                if (Array.isArray(res.data.data)) {
                    setArticles(res.data.data);
                } else {
                    console.error("Expected an array but got:", res.data.data);
                    setArticles([]);
                }
            })
            .catch((error) => console.error("Error fetching articles:", error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading articles...</p>;

    return (
        <div>
            <div
                className="modal fade"
                id="searchModal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >

                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content rounded-0">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Search by keyword</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body d-flex align-items-center">
                            <div className="input-group w-75 mx-auto d-flex">
                                <input
                                    type="search"
                                    className="form-control p-3"
                                    placeholder="keywords"
                                    aria-describedby="search-icon-1"
                                />

                                <span id="search-icon-1" className="input-group-text p-3"><i className="fa fa-search"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", position: "relative" }}>

                {/* MAIN CONTENT (shrinks when notes open) */}
                <div
                    style={{
                        flex: 1,
                        marginRight: openNotes ? "350px" : "0px",
                        transition: "all 0.3s ease",
                    }}
                >
                    {/* Toggle Arrow */}
                    <button
                        onClick={() => setOpenNotes(!openNotes)}
                        style={{
                            position: "fixed",
                            top: "150px",
                            right: openNotes ? "350px" : "0px",
                            zIndex: 9999,
                            background: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "5px 0 0 5px",
                            cursor: "pointer",
                        }}
                    >
                        {openNotes ? "◀" : "▶"}
                    </button>


                    {/* ⭐⭐⭐ YOUR ENTIRE FEATURES CODE (unchanged) ⭐⭐⭐ */}
                    <div className="container-fluid features mb-5">
                        <div className="container py-5">
                            <div className="row g-4">

                                <div className="col-md-6 col-lg-6 col-xl-3">
                                    <div className="row g-4 align-items-center features-item">
                                        <div className="col-4">
                                            <div className="rounded-circle position-relative">

                                                {articles.map((article) => (
                                                    <div key={article.id} className="overflow-hidden rounded-circle">
                                                        <img
                                                            src={
                                                                article.image?.[0]?.url
                                                                    ? `http://localhost:1337${article.image[0].url}`
                                                                    : "https://via.placeholder.com/150"
                                                            }
                                                            className="img-zoomin img-fluid rounded-circle w-100"
                                                            alt=""
                                                        />
                                                    </div>
                                                ))}

                                                <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute"
                                                    style={{ top: "10%", right: "-10px" }}>
                                                    3
                                                </span>
                                            </div>
                                        </div>

                                        {articles.map((article) => (
                                            <div key={article.id} className="col-8">
                                                <div className="features-content d-flex flex-column">
                                                    <p className="text-uppercase mb-2">{article.title}</p>

                                                    <Link to={`/articlesdetails`} className="h6">
                                                        {article.content
                                                            .map((b) =>
                                                                b.children?.map((c) => c.text).join(" "))
                                                            .join(" ")}
                                                    </Link>

                                                    <small className="text-body d-block">
                                                        <i className="fas fa-calendar-alt me-1"></i>
                                                        {article.createdAt}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-3">
                                    <div className="row g-4 align-items-center features-item">
                                        <div className="col-4">
                                            <div className="rounded-circle position-relative">
                                                <div className="overflow-hidden rounded-circle">
                                                    <img src="img/features-technology.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                </div>
                                                <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                            </div>
                                        </div>
                                        <div className="col-8">
                                            <div className="features-content d-flex flex-column">
                                                <p className="text-uppercase mb-2">Technology</p>
                                                <a href="#" className="h6">
                                                    Get the best speak market, news.
                                                </a>
                                                <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-3">
                                    <div className="row g-4 align-items-center features-item">
                                        <div className="col-4">
                                            <div className="rounded-circle position-relative">
                                                <div className="overflow-hidden rounded-circle">
                                                    <img src="img/features-fashion.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                </div>
                                                <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                            </div>
                                        </div>
                                        <div className="col-8">
                                            <div className="features-content d-flex flex-column">
                                                <p className="text-uppercase mb-2">Fashion</p>
                                                <a href="#" className="h6">
                                                    Get the best speak market, news.
                                                </a>
                                                <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-3">
                                    <div className="row g-4 align-items-center features-item">
                                        <div className="col-4">
                                            <div className="rounded-circle position-relative">
                                                <div className="overflow-hidden rounded-circle">
                                                    <img src="img/features-life-style.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                </div>
                                                <span
                                                    className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute"
                                                    style={{ top: "10%", right: "-10px" }}
                                                >
                                                    3
                                                </span>

                                            </div>
                                        </div>
                                        <div className="col-8">
                                            <div className="features-content d-flex flex-column">
                                                <p className="text-uppercase mb-2">Life Style</p>
                                                <a href="#" className="h6">
                                                    Get the best speak market, news.
                                                </a>
                                                <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* REST OF YOUR CODE UNCHANGED */}
                            </div>
                        </div>
                    </div>
                    {/* END FEATURES CODE */}
                </div>


                {/* ======================== WHITEBOARD PANEL ======================== */}
                {openNotes && (
                    <div
                        style={{
                            width: "350px",
                            height: "100vh",
                            background: "white",
                            position: "fixed",
                            top: 0,
                            right: 0,
                            zIndex: 9998,
                            padding: "15px",
                            borderLeft: "1px solid #ddd",
                            overflowY: "auto",
                        }}
                    >
                        <h5 className="mb-3">✏️ Write Notes</h5>

                        {/* TEXTBOX FLOATING */}
                        {showTextBox && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 70,
                                    left: 20,
                                    zIndex: 2000,
                                    background: "white",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                    width: "250px",
                                }}
                            >
                                <input
                                    className="form-control"
                                    placeholder="Type text & Enter"
                                    value={textValue}
                                    autoFocus
                                    onChange={(e) => setTextValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && applyTextToCanvas()}
                                />
                            </div>
                        )}

                        {/* TOOLBOX */}
                        <div
                            style={{
                                background: "#f8f9fa",
                                padding: "10px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                marginBottom: "10px",
                            }}
                        >
                            <div className="d-flex justify-content-between mb-2">
                                <strong>Tools</strong>
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setShowToolbox(!showToolbox)}
                                >
                                    {showToolbox ? "–" : "+"}
                                </button>
                            </div>

                            {showToolbox && (
                                <>
                                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => toggleEraser(false)}>
                                        ✏️ Pen
                                    </button>

                                    <button className="btn btn-sm btn-outline-danger" onClick={() => toggleEraser(true)}>
                                        🧽 Eraser
                                    </button>

                                    <div className="mt-2">
                                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => callCanvas("undo")}>
                                            ↶ Undo
                                        </button>

                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => callCanvas("redo")}>
                                            ↷ Redo
                                        </button>
                                    </div>

                                    <button className="btn btn-sm btn-outline-dark mt-2" onClick={() => callCanvas("clearCanvas")}>
                                        🗑 Clear
                                    </button>

                                    <div className="mt-2 d-flex align-items-center">
                                        <input type="color" value={strokeColor}
                                            onChange={(e) => {
                                                setStrokeColor(e.target.value);
                                                if (isErasing) toggleEraser(false);
                                            }} />
                                        <small className="ms-2">{strokeColor}</small>
                                    </div>

                                    <div className="mt-2 d-flex align-items-center">
                                        <input
                                            type="range"
                                            min="1"
                                            max="20"
                                            value={strokeWidth}
                                            onChange={(e) => setStrokeWidth(Number(e.target.value))}
                                        />
                                        <small className="ms-2">{strokeWidth}px</small>
                                    </div>

                                    <button className="btn btn-sm btn-outline-info mt-2" onClick={handleAddText}>
                                        🔤 Text
                                    </button>

                                    <label className="btn btn-sm btn-outline-primary mt-2 w-100">
                                        🖼 Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleImageUpload(file);
                                            }}
                                        />
                                    </label>
                                </>
                            )}
                        </div>

                        {/* WHITEBOARD */}
                        <ReactSketchCanvas
                            ref={canvasRef}
                            style={canvasStyles}
                            strokeWidth={strokeWidth}
                            strokeColor={isErasing ? "#ffffff" : strokeColor}
                        />

                        {/* SIMPLE NOTES TEXTBOX */}
                        <div style={{ marginTop: "15px" }}>
                            <h6>📝 Type Notes</h6>
                            <input type="hidden" value={id ?? ""} />

             
                            <textarea
                                className="form-control"
                                placeholder="Write your notes here..."
                                value={notesText}
                                onChange={(e) => setNotesText(e.target.value)}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    resize: "vertical",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                }}
                            ></textarea>
                            {/* <button
  className="btn btn-success mt-3 w-100"
  onClick={saveNotesToDB}
>
  💾 Save Notes
</button> */}
                            <button
                                className="btn btn-success mt-3 w-100"
                                onClick={async () => {

                                    try {
                                        // 1️⃣ Export merged canvas + uploaded image
                                        const finalImg = await mergeCanvasWithImage();

                                        // 2️⃣ Save into React state
                                        setCanvasImg(finalImg);

                                        // 3️⃣ Send to backend
                                        await saveNotesToDB();

                                    } catch (err) {
                                        console.error("Save failed:", err);
                                    }

                                }}
                            >
                                💾 Save Notes
                            </button>


                            {saveMessage && (
                                <p style={{ marginTop: "10px", color: "green", fontWeight: "bold" }}>
                                    {saveMessage}
                                </p>
                            )}



                        </div>

                    </div>
                )}
            </div>


            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row g-4">
                        <div className="col-lg-7 col-xl-8 mt-0">
                            <div className="position-relative overflow-hidden rounded">
                                <img src="img/news-1.jpg" className="img-fluid rounded img-zoomin w-100" alt="" />
                                <div
                                    className="d-flex justify-content-center px-4 position-absolute flex-wrap"
                                    style={{ bottom: "10px", left: 0 }}
                                >

                                    <a href="#" className="text-white me-3 link-hover"><i className="fa fa-clock"></i> 06 minute read</a>
                                    <a href="#" className="text-white me-3 link-hover"><i className="fa fa-eye"></i> 3.5k Views</a>
                                    <a href="#" className="text-white me-3 link-hover"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                    <a href="#" className="text-white link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                </div>
                            </div>
                            <div className="border-bottom py-3">
                                <a href="#" className="display-4 text-dark mb-0 link-hover">Lorem Ipsum is simply dummy text of the printing</a>
                            </div>
                            <p className="mt-3 mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley standard dummy text ever since the 1500s, when an unknown printer took a galley...
                            </p>
                            <div className="bg-light p-4 rounded">
                                <div className="news-2">
                                    <h3 className="mb-4">Top Story</h3>
                                </div>
                                <div className="row g-4 align-items-center">
                                    <div className="col-md-6">
                                        <div className="rounded overflow-hidden">
                                            <img src="img/news-2.jpg" className="img-fluid rounded img-zoomin w-100" alt="" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex flex-column">
                                            <a href="#" className="h3">Stoneman Clandestine Ukrainian claims successes against Russian.</a>
                                            <p className="mb-0 fs-5"><i className="fa fa-clock"> 06 minute read</i> </p>
                                            <p className="mb-0 fs-5"><i className="fa fa-eye"> 3.5k Views</i></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5 col-xl-4">
                            <div className="bg-light rounded p-4 pt-0">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="rounded overflow-hidden">
                                            <img src="img/news-3.jpg" className="img-fluid rounded img-zoomin w-100" alt="" />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-flex flex-column">
                                            <a href="#" className="h4 mb-2">Get the best speak market, news.</a>
                                            <p className="fs-5 mb-0"><i className="fa fa-clock"> 06 minute read</i> </p>
                                            <p className="fs-5 mb-0"><i className="fa fa-eye"> 3.5k Views</i></p>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row g-4 align-items-center">
                                            <div className="col-5">
                                                <div className="overflow-hidden rounded">
                                                    <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                </div>
                                            </div>
                                            <div className="col-7">
                                                <div className="features-content d-flex flex-column">
                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                    <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                    <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row g-4 align-items-center">
                                            <div className="col-5">
                                                <div className="overflow-hidden rounded">
                                                    <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                </div>
                                            </div>
                                            <div className="col-7">
                                                <div className="features-content d-flex flex-column">
                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                    <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                    <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row g-4 align-items-center">
                                            <div className="col-5">
                                                <div className="overflow-hidden rounded">
                                                    <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                </div>
                                            </div>
                                            <div className="col-7">
                                                <div className="features-content d-flex flex-column">
                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                    <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                    <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row g-4 align-items-center">
                                            <div className="col-5">
                                                <div className="overflow-hidden rounded">
                                                    <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                </div>
                                            </div>
                                            <div className="col-7">
                                                <div className="features-content d-flex flex-column">
                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                    <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                    <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row g-4 align-items-center">
                                            <div className="col-5">
                                                <div className="overflow-hidden rounded">
                                                    <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                </div>
                                            </div>
                                            <div className="col-7">
                                                <div className="features-content d-flex flex-column">
                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                    <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                    <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row g-4 align-items-center">
                                            <div className="col-5">
                                                <div className="overflow-hidden rounded">
                                                    <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                </div>
                                            </div>
                                            <div className="col-7">
                                                <div className="features-content d-flex flex-column">
                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                    <small><i className="fa fa-clock"> 06 minute read</i> </small>
                                                    <small><i className="fa fa-eye"> 3.5k Views</i></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="container-fluid py-5 my-5"
                style={{ background: "linear-gradient(rgba(202, 203, 185, 1), rgba(202, 203, 185, 1))" }}
            >

                <div className="container">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-7">
                            <h1 className="mb-4 text-primary">Newsers</h1>
                            <h1 className="mb-4">Get Every Weekly Updates</h1>
                            <p className="text-dark mb-4 pb-2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
                            </p>
                            <div className="position-relative mx-auto">
                                <input
                                    className="form-control w-100 py-3 rounded-pill"
                                    type="email"
                                    placeholder="Your Business Email"
                                />

                                <button type="submit" className="btn btn-primary py-3 px-5 position-absolute rounded-pill text-white h-100" style={{ top: "0", right: "0" }}>Subscribe Now</button>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="rounded">
                                <img src="/img/banner-img.jpg" className="img-fluid rounded w-100 rounded" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid latest-news py-5">
                <div className="container py-5">
                    <h2 className="mb-4">Latest News</h2>
                    <div className="latest-news-carousel owl-carousel">
                        <div className="latest-news-item">
                            <div className="bg-light rounded">
                                <div className="rounded-top overflow-hidden">

                                    <img src="/img/news-7.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                </div>
                                <div className="d-flex flex-column p-4">
                                    <a href="#" className="h4">Lorem Ipsum is simply dummy text of...</a>
                                    <div className="d-flex justify-content-between">
                                        <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="latest-news-item">
                            <div className="bg-light rounded">
                                <div className="rounded-top overflow-hidden">
                                    <img src="/img/news-6.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                </div>
                                <div className="d-flex flex-column p-4">
                                    <a href="#" className="h4">Lorem Ipsum is simply dummy text of...</a>
                                    <div className="d-flex justify-content-between">
                                        <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="latest-news-item">
                            <div className="bg-light rounded">
                                <div className="rounded-top overflow-hidden">
                                    <img src="/img/news-3.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                </div>
                                <div className="d-flex flex-column p-4">
                                    <a href="#" className="h4">Lorem Ipsum is simply dummy text of...</a>
                                    <div className="d-flex justify-content-between">
                                        <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="latest-news-item">
                            <div className="bg-light rounded">
                                <div className="rounded-top overflow-hidden">
                                    <img src="/img/news-4.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                </div>
                                <div className="d-flex flex-column p-4">
                                    <a href="#" className="h4">Lorem Ipsum is simply dummy text of...</a>
                                    <div className="d-flex justify-content-between">
                                        <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="latest-news-item">
                            <div className="bg-light rounded">
                                <div className="rounded-top overflow-hidden">
                                    <img src="/img/news-5.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                </div>
                                <div className="d-flex flex-column p-4">
                                    <a href="#" className="h4 ">Lorem Ipsum is simply dummy text of...</a>
                                    <div className="d-flex justify-content-between">
                                        <a href="#" className="small text-body link-hover">by Willum Skeem</a>
                                        <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid populer-news py-5">
                <div className="container py-5">
                    <div className="tab-className mb-4">
                        <div className="row g-4">
                            <div className="col-lg-8 col-xl-9">
                                <div className="d-flex flex-column flex-md-row justify-content-md-between border-bottom mb-4">
                                    <h1 className="mb-4">What’s New</h1>
                                    <ul className="nav nav-pills d-inline-flex text-center">
                                        <li className="nav-item mb-3">
                                            <a className="d-flex py-2 bg-light rounded-pill active me-2" data-bs-toggle="pill" href="#tab-1">
                                                <span className="text-dark" style={{ width: "100px" }}>Sports</span>
                                            </a>
                                        </li>
                                        <li className="nav-item mb-3">
                                            <a className="d-flex py-2 bg-light rounded-pill me-2" data-bs-toggle="pill" href="#tab-2">
                                                <span className="text-dark" style={{ width: "100px" }}>Magazine</span>
                                            </a>
                                        </li>
                                        <li className="nav-item mb-3">
                                            <a className="d-flex py-2 bg-light rounded-pill me-2" data-bs-toggle="pill" href="#tab-3">
                                                <span className="text-dark" style={{ width: "100px" }}>Politics</span>
                                            </a>
                                        </li>
                                        <li className="nav-item mb-3">
                                            <a className="d-flex py-2 bg-light rounded-pill me-2" data-bs-toggle="pill" href="#tab-4">
                                                <span className="text-dark" style={{ width: "100px" }}>Technology</span>
                                            </a>
                                        </li>
                                        <li className="nav-item mb-3">
                                            <a className="d-flex py-2 bg-light rounded-pill me-2" data-bs-toggle="pill" href="#tab-5">
                                                <span className="text-dark" style={{ width: "100px" }}>Fashion</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content mb-4">
                                    <div id="tab-1" className="tab-pane fade show p-0 active">
                                        <div className="row g-4">
                                            <div className="col-lg-8">
                                                <div className="position-relative rounded overflow-hidden">
                                                    <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                        Sports
                                                    </div>
                                                </div>
                                                <div className="my-4">
                                                    <a href="#" className="h4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                    <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                </div>
                                                <p className="my-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy..
                                                </p>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="row g-4">
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Sports</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Sports</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Sports</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Sports</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Magazine</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="tab-2" className="tab-pane fade show p-0">
                                        <div className="row g-4">
                                            <div className="col-lg-8">
                                                <div className="position-relative rounded overflow-hidden">
                                                    <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                        Magazine
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <a href="#" className="h4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                                                </div>
                                                <p className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy..
                                                </p>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                    <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="row g-4">
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Magazine</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Magazine</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Magazine</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Magazine</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Magazine</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="tab-3" className="tab-pane fade show p-0">
                                        <div className="row g-4">
                                            <div className="col-lg-8">
                                                <div className="position-relative rounded overflow-hidden">
                                                    <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                        Politics
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <a href="#" className="h4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                                                </div>
                                                <p className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy..
                                                </p>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                    <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="row g-4">
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Politics</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Politics</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Politics</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Politics</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Politics</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="tab-4" className="tab-pane fade show p-0">
                                        <div className="row g-4">
                                            <div className="col-lg-8">
                                                <div className="position-relative rounded overflow-hidden">
                                                    <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                        Technology
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <a href="#" className="h4">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</a>
                                                </div>
                                                <p className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy
                                                </p>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                    <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="row g-4">
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Technology</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Technology</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Technology</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Technology</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Technology</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="tab-5" className="tab-pane fade show p-0">
                                        <div className="row g-4">
                                            <div className="col-lg-8">
                                                <div className="position-relative rounded overflow-hidden">
                                                    <img src="img/news-1.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                    <div className="position-absolute text-white px-4 py-2 bg-primary rounded" style={{ top: "20px", right: "20px" }}>
                                                        Fashion
                                                    </div>
                                                </div>
                                                <div className="my-3">
                                                    <a href="#" className="h4">World Happiness Report 2023: What's the highway to happiness?</a>
                                                </div>
                                                <p className="mt-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy Lorem Ipsum has been the industry's standard dummy
                                                </p>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-clock"></i> 06 minute read</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-eye"></i> 3.5k Views</a>
                                                    <a href="#" className="text-dark link-hover me-3"><i className="fa fa-comment-dots"></i> 05 Comment</a>
                                                    <a href="#" className="text-dark link-hover"><i className="fa fa-arrow-up"></i> 1.5k Share</a>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="row g-4">
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Fashion</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Fashion</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Fashion</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Fashion</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row g-4 align-items-center">
                                                            <div className="col-5">
                                                                <div className="overflow-hidden rounded">
                                                                    <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded w-100" alt="" />
                                                                </div>
                                                            </div>
                                                            <div className="col-7">
                                                                <div className="features-content d-flex flex-column">
                                                                    <p className="text-uppercase mb-2">Fashion</p>
                                                                    <a href="#" className="h6">Get the best speak market, news.</a>
                                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-bottom mb-4">
                                    <h2 className="my-4">Most Views News</h2>
                                </div>
                                <div className="whats-carousel owl-carousel">
                                    <div className="latest-news-item">
                                        <div className="bg-light rounded">
                                            <div className="rounded-top overflow-hidden">
                                                <img src="img/news-7.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                            </div>
                                            <div className="d-flex flex-column p-4">
                                                <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="whats-item">
                                        <div className="bg-light rounded">
                                            <div className="rounded-top overflow-hidden">
                                                <img src="img/news-6.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                            </div>
                                            <div className="d-flex flex-column p-4">
                                                <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="whats-item">
                                        <div className="bg-light rounded">
                                            <div className="rounded-top overflow-hidden">
                                                <img src="img/news-3.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                            </div>
                                            <div className="d-flex flex-column p-4">
                                                <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="whats-item">
                                        <div className="bg-light rounded">
                                            <div className="rounded-top overflow-hidden">
                                                <img src="img/news-4.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                            </div>
                                            <div className="d-flex flex-column p-4">
                                                <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="whats-item">
                                        <div className="bg-light rounded">
                                            <div className="rounded-top overflow-hidden">
                                                <img src="img/news-5.jpg" className="img-zoomin img-fluid rounded-top w-100" alt="" />
                                            </div>
                                            <div className="d-flex flex-column p-4">
                                                <a href="#" className="h4">There are many variations of passages of Lorem Ipsum available,</a>
                                                <div className="d-flex justify-content-between">
                                                    <a href="#" className="small text-body link-hover">by Willium Smith</a>
                                                    <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 lifestyle">
                                    <div className="border-bottom mb-4">
                                        <h1 className="mb-4">Life Style</h1>
                                    </div>
                                    <div className="row g-4">
                                        <div className="col-lg-6">
                                            <div className="lifestyle-item rounded">
                                                <img src="img/lifestyle-1.jpg" className="img-fluid w-100 rounded" alt="" />
                                                <div className="lifestyle-content">
                                                    <div className="mt-auto">
                                                        <a href="#" className="h4 text-white link-hover">There are many variations of passages of Lorem Ipsum available,</a>
                                                        <div className="d-flex justify-content-between mt-4">
                                                            <a href="#" className="small text-white link-hover">By Willium Smith</a>
                                                            <small className="text-white d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">

                                            <div className="lifestyle-item rounded">
                                                <img src="img/lifestyle-2.jpg" className="img-fluid w-100 rounded" alt="" />

                                                <div className="lifestyle-content">
                                                    <div className="mt-auto">
                                                        <a href="#" className="h4 text-white link-hover">There are many variations of passages of Lorem Ipsum available,</a>
                                                        <div className="d-flex justify-content-between mt-4">
                                                            <a href="#" className="small text-white link-hover">By Willium Smith</a>
                                                            <small className="text-white d-block"><i className="fas fa-calendar-alt me-1"></i> Dec 9, 2024</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-xl-3">
                                <div className="row g-4">
                                    <div className="col-12">
                                        <div className="p-3 rounded border">
                                            <h4 className="mb-4">Stay Connected</h4>
                                            <div className="row g-4">
                                                <div className="col-12">
                                                    <a href="#" className="w-100 rounded btn btn-primary d-flex align-items-center p-3 mb-2">
                                                        <i className="fab fa-facebook-f btn btn-light btn-square rounded-circle me-3"></i>
                                                        <span className="text-white">13,977 Fans</span>
                                                    </a>
                                                    <a href="#" className="w-100 rounded btn btn-danger d-flex align-items-center p-3 mb-2">
                                                        <i className="fab fa-twitter btn btn-light btn-square rounded-circle me-3"></i>
                                                        <span className="text-white">21,798 Follower</span>
                                                    </a>
                                                    <a href="#" className="w-100 rounded btn btn-warning d-flex align-items-center p-3 mb-2">
                                                        <i className="fab fa-youtube btn btn-light btn-square rounded-circle me-3"></i>
                                                        <span className="text-white">7,999 Subscriber</span>
                                                    </a>
                                                    <a href="#" className="w-100 rounded btn btn-dark d-flex align-items-center p-3 mb-2">
                                                        <i className="fab fa-instagram btn btn-light btn-square rounded-circle me-3"></i>
                                                        <span className="text-white">19,764 Follower</span>
                                                    </a>
                                                    <a href="#" className="w-100 rounded btn btn-secondary d-flex align-items-center p-3 mb-2">
                                                        <i className="bi-cloud btn btn-light btn-square rounded-circle me-3"></i>
                                                        <span className="text-white">31,999 Subscriber</span>
                                                    </a>
                                                    <a href="#" className="w-100 rounded btn btn-warning d-flex align-items-center p-3 mb-4">
                                                        <i className="fab fa-dribbble btn btn-light btn-square rounded-circle me-3"></i>
                                                        <span className="text-white">37,999 Subscriber</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <h4 className="my-4">Popular News</h4>
                                            <div className="row g-4">
                                                <div className="col-12">
                                                    <div className="row g-4 align-items-center features-item">
                                                        <div className="col-4">
                                                            <div className="rounded-circle position-relative">
                                                                <div className="overflow-hidden rounded-circle">
                                                                    <img src="img/features-sports-1.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                                </div>
                                                                <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="features-content d-flex flex-column">
                                                                <p className="text-uppercase mb-2">Sports</p>
                                                                <a href="#" className="h6">
                                                                    Get the best speak market, news.
                                                                </a>
                                                                <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row g-4 align-items-center features-item">
                                                        <div className="col-4">
                                                            <div className="rounded-circle position-relative">
                                                                <div className="overflow-hidden rounded-circle">
                                                                    <img src="img/features-technology.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                                </div>
                                                                <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="features-content d-flex flex-column">
                                                                <p className="text-uppercase mb-2">Technology</p>
                                                                <a href="#" className="h6">
                                                                    Get the best speak market, news.
                                                                </a>
                                                                <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row g-4 align-items-center features-item">
                                                        <div className="col-4">
                                                            <div className="rounded-circle position-relative">
                                                                <div className="overflow-hidden rounded-circle">
                                                                    <img src="img/features-fashion.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                                </div>
                                                                <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="features-content d-flex flex-column">
                                                                <p className="text-uppercase mb-2">Fashion</p>
                                                                <a href="#" className="h6">
                                                                    Get the best speak market, news.
                                                                </a>
                                                                <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row g-4 align-items-center features-item">
                                                        <div className="col-4">
                                                            <div className="rounded-circle position-relative">
                                                                <div className="overflow-hidden rounded-circle">
                                                                    <img src="img/features-life-style.jpg" className="img-zoomin img-fluid rounded-circle w-100" alt="" />
                                                                </div>
                                                                <span className="rounded-circle border border-2 border-white bg-primary btn-sm-square text-white position-absolute" style={{ top: "10%", right: "-10px" }}>3</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-8">
                                                            <div className="features-content d-flex flex-column">
                                                                <p className="text-uppercase mb-2">Life Style</p>
                                                                <a href="#" className="h6">
                                                                    Get the best speak market, news.
                                                                </a>
                                                                <small className="text-body d-block"><i className="fas fa-calendar-alt me-1"></i> December 9, 2024</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <a href="#" className="link-hover btn border border-primary rounded-pill text-dark w-100 py-3 mb-4">View More</a>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="border-bottom my-3 pb-3">
                                                        <h4 className="mb-0">Trending Tags</h4>
                                                    </div>
                                                    <ul className="nav nav-pills d-inline-flex text-center mb-4">
                                                        <li className="nav-item mb-3">
                                                            <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                <span className="text-dark link-hover" style={{ width: "90px" }}>Lifestyle</span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item mb-3">
                                                            <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                <span className="text-dark link-hover" style={{ width: "90px" }}>Sports</span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item mb-3">
                                                            <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                <span className="text-dark link-hover" style={{ width: "90px" }}>Politics</span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item mb-3">
                                                            <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                <span className="text-dark link-hover" style={{ width: "90px" }}>Magazine</span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item mb-3">
                                                            <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                <span className="text-dark link-hover" style={{ width: "90px" }}>Game</span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item mb-3">
                                                            <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                <span className="text-dark link-hover" style={{ width: "90px" }}>Movie</span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item mb-3">
                                                            <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                <span className="text-dark link-hover" style={{ width: "90px" }}>Travel</span>
                                                            </a>
                                                        </li>
                                                        <li className="nav-item mb-3">
                                                            <a className="d-flex py-2 bg-light rounded-pill me-2" href="#">
                                                                <span className="text-dark link-hover" style={{ width: "90px" }}>World</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="position-relative banner-2">
                                                        <img src="img/banner-2.jpg" className="img-fluid w-100 rounded" alt="" />
                                                        <div className="text-center banner-content-2">
                                                            <h6 className="mb-2">The Most Populer</h6>
                                                            <p className="text-white mb-2">News & Magazine WP Theme</p>
                                                            <a href="#" className="btn btn-primary text-white px-4">Shop Now</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





        </div>



    );
};


export default Articles;
