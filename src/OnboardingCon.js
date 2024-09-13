import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Onboarding from "./Pages/Onboarding";
import Onboarding2 from "./Pages/Onboarding2";
import Onboarding3 from "./Pages/Onboarding3";

export default function OnboardingContainer({ handleOnboardingComplete }) {
  const [step, setStep] = useState(0);
  const navigate = useNavigate(); 

  const handleNext = () => {
    if (step < 2) {
      setStep((prevStep) => prevStep + 1);
    } else {
      console.log("Onboarding complete, navigating to /messages");

      handleOnboardingComplete(); 
      navigate("/messages"); 
    }
  };

  const handleBack = () => {
    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
  };

  const buttonText = step === 2 ? "Finish" : "Next";
  const isNextDisabled = step === 3 && buttonText === "Finish";

  return (
    <Box>
      {step === 0 && <Onboarding handleNext={handleNext} />}
      {step === 1 && (
        <Onboarding2 handleNext={handleNext} handleBack={handleBack} />
      )}
      {step === 2 && (
        <Onboarding3
          handleNext={handleNext}
          handleBack={handleBack}
        />
      )}

      <Box sx={{ my: 2, textAlign: "center" }}>
        <Button
          onClick={handleBack}
          disabled={step === 0}
          variant="outlined"
          sx={{ mr: 2, borderRadius: 7 }}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          variant="contained"
          sx={{ borderRadius: 7 }}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
}
