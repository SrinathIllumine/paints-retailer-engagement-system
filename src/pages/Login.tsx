import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, KeyRound, AlertCircle } from "lucide-react";

const VALID_CREDENTIALS = [
  { phone: "0123456789", otp: "123456" },
  { phone: "9876543210", otp: "123456" },
];

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    setOtpSent(true);
  };

  const handleLogin = () => {
    const match = VALID_CREDENTIALS.find(c => c.phone === phone && c.otp === otp);
    if (match) {
      setError("");
      navigate("/home");
    } else {
      setError("Invalid phone number or OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Retailer Engagement Platform
          </div>
          <h1 className="font-display font-bold text-3xl text-foreground">JK Cement</h1>
          <p className="text-muted-foreground text-sm">Sign in to continue</p>
        </div>

        <Card className="p-6 space-y-4">
          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                className="pl-10 h-12 rounded-xl"
                maxLength={10}
              />
            </div>
          </div>

          {!otpSent ? (
            <Button variant="field" className="w-full h-12 rounded-xl" onClick={handleSendOtp}>
              Send OTP
            </Button>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">OTP</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError(""); }}
                    className="pl-10 h-12 rounded-xl"
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-muted-foreground">OTP sent to {phone}</p>
              </div>

              <Button variant="field" className="w-full h-12 rounded-xl" onClick={handleLogin}>
                Verify & Login
              </Button>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
        </Card>

        <p className="text-xs text-center text-muted-foreground">Demo: 0123456789 / 123456</p>
      </div>
    </div>
  );
};

export default Login;
