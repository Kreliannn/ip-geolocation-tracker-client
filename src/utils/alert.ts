import Swal from "sweetalert2";
import type { accountInterface } from "../types/account.type";


export const showAccount = (account: accountInterface) => {
  Swal.fire({
    icon: "success",
    title: "Account Created!",
    html: `
      <p><strong>Name:</strong> ${account.name}</p>
      <p><strong>Email:</strong> ${account.email}</p>
      <p><strong>Password:</strong> 12345 </p>
    `,
    showConfirmButton: true,
    confirmButtonText: "OK",
    background: "#0f172a",  // slate-950
    color: "#f1f5f9",       // slate-100
  });
};
export const showSuccess = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    timer: 2000,
    showConfirmButton: false,
    background: "#0f172a",  // slate-950
    color: "#f1f5f9",       // slate-100
  });
};

export const showError = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    background: "#0f172a",
    color: "#f1f5f9",
  });
};

export const confirmAlert = (
  text: string,
  buttonText: string,
  callback: () => void
) => {
  Swal.fire({
    title: "Are you sure?",
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: buttonText,
    cancelButtonText: "Cancel",
    buttonsStyling: false,
    background: "#0f172a",  // slate-950
    color: "#f1f5f9",       // slate-100

    didOpen: () => {
      const popup = Swal.getPopup();
      const confirmBtn = Swal.getConfirmButton();
      const cancelBtn = Swal.getCancelButton();

      // Style popup/card
      if (popup) {
        popup.style.borderRadius = "12px";
        popup.style.border = "1px solid #1e293b"; // slate-800
        popup.style.padding = "24px";
        popup.style.display = "flex";
        popup.style.flexDirection = "column";
        popup.style.alignItems = "center";
        popup.style.boxShadow = "0 25px 50px rgba(0,0,0,0.6)";
      }

      // Create button wrapper with gap
      if (confirmBtn && cancelBtn) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.gap = "12px";
        wrapper.style.marginTop = "16px";

        confirmBtn.parentNode?.insertBefore(wrapper, confirmBtn);
        wrapper.appendChild(confirmBtn);
        wrapper.appendChild(cancelBtn);
      }

      // Base button style
      const baseStyle: Partial<CSSStyleDeclaration> = {
        padding: "8px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "14px",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.4)",
        transition: "all 0.15s ease",
      };
      if (confirmBtn) Object.assign(confirmBtn.style, baseStyle);
      if (cancelBtn) Object.assign(cancelBtn.style, baseStyle);

      // Confirm → sky-500 button
      if (confirmBtn) {
        confirmBtn.style.background = "#0ea5e9"; // sky-500
        confirmBtn.style.color = "#ffffff";
        confirmBtn.style.border = "1px solid #0284c7"; // sky-600
      }

      // Cancel → slate outline
      if (cancelBtn) {
        cancelBtn.style.background = "transparent";
        cancelBtn.style.color = "#94a3b8";        // slate-400
        cancelBtn.style.border = "1px solid #334155"; // slate-700
      }

      // Hover effects
      if (confirmBtn) {
        confirmBtn.onmouseenter = () => {
          confirmBtn.style.background = "#38bdf8"; // sky-400
          confirmBtn.style.boxShadow = "6px 6px 0 rgba(0,0,0,0.4)";
        };
        confirmBtn.onmouseleave = () => {
          confirmBtn.style.background = "#0ea5e9";
          confirmBtn.style.boxShadow = "4px 4px 0 rgba(0,0,0,0.4)";
        };
      }
      if (cancelBtn) {
        cancelBtn.onmouseenter = () => {
          cancelBtn.style.background = "#1e293b"; // slate-800
          cancelBtn.style.color = "#f1f5f9";
          cancelBtn.style.borderColor = "#475569"; // slate-600
          cancelBtn.style.boxShadow = "6px 6px 0 rgba(0,0,0,0.4)";
        };
        cancelBtn.onmouseleave = () => {
          cancelBtn.style.background = "transparent";
          cancelBtn.style.color = "#94a3b8";
          cancelBtn.style.borderColor = "#334155";
          cancelBtn.style.boxShadow = "4px 4px 0 rgba(0,0,0,0.4)";
        };
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};