import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import Review from "./components/review";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";


const App = () => {
  const [image, setImage] = useState(null);
  const [review, setReview] = useState(false)
  const [take, setTake] = useState(true)

  const [extractedData, setExtractedData] = useState(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null)

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const [authView, setAuthView] = useState("login"); // "login" or "signup"



  // On first load, check if a token already exists (user refreshed the page)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setRole(savedRole);
    }
  }, []);

  const handleLoginSuccess = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
  };

  if (!isLoggedIn) {
    return authView === "login" ? (
      <Login onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setAuthView("signup")} />
    ) : (
      <Signup onSignupSuccess={() => setAuthView("login")} onSwitchToLogin={() => setAuthView("login")} />
    );
  }

  if (role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }


  const handleCapture = (e) => {
    const file = e.target.files[0];


    if (file) {
      fileRef.current = file;
      setImage(URL.createObjectURL(file));
    }
  };

  const handleGeneration = async () => {

    const formData = new FormData();
    formData.append("receipt", fileRef.current)
    let result = await fetch('http://localhost:5003/receipts', {
      method: "POST",
      body: formData
    })

    const extractedData = await result.json();
    setExtractedData(extractedData);
    console.log(extractedData); // confirm the shape before wiring further

    setReview(true)
    setTake(false)
  };

  return (
    <div className="w-96 mx-auto py-10 text-center space-y-6">
      <button
        onClick={handleLogout}
        className="fixed right-4 top-4 shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
      >
        Log out
      </button>

      {take && <div>
        <div>
          <h2 className="text-3xl font-bold text-black">Upload Receipt</h2>
          <p className="text-gray-500 mt-2">Take a photo or upload an image of your receipt.</p>
          <p className="text-gray-500">We will extract it for you.</p>
        </div>

        {!image && (
          <label className="upload-card block">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
              style={{ display: "none" }}
            />
            <div className="w-80 h-56 mx-auto border-2 border-dashed border-green-200 rounded-2xl flex items-center justify-center bg-white cursor-pointer hover:bg-green-50/30 transition-colors">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-semibold text-green-600">Tap to take a photo</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-[220px] mx-auto leading-relaxed">
                  Position the receipt clearly in the frame
                </p>
              </div>
            </div>
          </label>
        )}
        {image && (
          <div className="space-y-3">
            <img src={image} alt="Captured receipt" className="w-80 mx-auto rounded-2xl shadow" />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCapture}
              ref={inputRef}
              style={{ display: "none" }}
            />
            <button
              onClick={() => inputRef.current.click()}
              className="text-green-600 font-semibold underline"
            >
              Retake
            </button>
          </div>
        )}

        <button
          onClick={handleGeneration}
          className="w-36 mx-auto mt-2 rounded-xl bg-green-600 cursor-pointer px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-green-700 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Digitize
        </button>
      </div>


      }




      {review && (<Review data={extractedData} setTake={setTake} setReview={setReview} />)}
    </div>
  );
};

export default App;