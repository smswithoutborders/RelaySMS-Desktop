import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Signup from "./Components/Signup";

test("submits login form", () => {
  const handleLoginSubmit = jest.fn();

  render(
    <Signup
      open={true}
      onClose={() => {}}
      handleLoginSubmit={handleLoginSubmit}
    />
  );

  fireEvent.change(screen.getByLabelText(/phone number/i), {
    target: { value: "+237123456789" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "Password@123" },
  });
  fireEvent.change(screen.getByLabelText(/repeatpassword/i), {
    target: { value: "Password@123" },
  });
  fireEvent.click(screen.getByText(/signUp/i));

  expect(handleLoginSubmit).toHaveBeenCalledTimes(1);
});
