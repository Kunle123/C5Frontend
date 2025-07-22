import React, { useRef, forwardRef, useImperativeHandle } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export interface CaptchaRef {
  execute: () => void;
  reset: () => void;
  getValue: () => string | null;
}

interface CaptchaComponentProps {
  siteKey: string; // You'll need to get this from Google reCAPTCHA console
  onChange: (token: string | null) => void;
  onError?: () => void;
  onExpired?: () => void;
  theme?: "light" | "dark";
  size?: "compact" | "normal" | "invisible";
  className?: string;
}

const CaptchaComponent = forwardRef<CaptchaRef, CaptchaComponentProps>(
  ({ siteKey, onChange, onError, onExpired, theme = "light", size = "normal", className = "" }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    useImperativeHandle(ref, () => ({
      execute: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.execute();
        }
      },
      reset: () => {
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
      },
      getValue: () => {
        if (recaptchaRef.current) {
          return recaptchaRef.current.getValue();
        }
        return null;
      }
    }));

    // For demo purposes, using a test site key. Replace with your actual site key.
    const testSiteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

    return (
      <div className={`flex justify-center ${className}`}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey || testSiteKey}
          onChange={onChange}
          onError={onError}
          onExpired={onExpired}
          theme={theme}
          size={size}
        />
      </div>
    );
  }
);

CaptchaComponent.displayName = "CaptchaComponent";

export default CaptchaComponent; 