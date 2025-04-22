ResumeBuilder
├─ assets
├─ auth.html
├─ builder.html
├─ index.html
├─ README.md
├─ scripts
│  ├─ ai.js
│  ├─ auth.js
│  ├─ chatbot.js
│  ├─ firebase.js
│  ├─ main.js
│  ├─ pdf.js
│  └─ templates.js
├─ styles
│  ├─ auth.css
│  ├─ builder.css
│  └─ main.css
└─ templates
   ├─ template1.html
   └─ template2.html

## Key Features

*   **AI-Powered Refinement:** Uses the Gemini API to refine resume summaries.
*   **Customizable Templates:** Offers classic and modern resume templates.
*   **PDF Export:** Generates high-quality PDF resumes.
*   **Chat Assistant:** Provides a chatbot assistant for help and guidance.
*   **Firebase Authentication:** Uses Firebase for user authentication (email/password and Google Sign-In).

## Technologies Used

*   HTML
*   CSS
*   JavaScript
*   Firebase
*   Gemini AI API
*   Mustache.js
*   html2pdf.js

## Setup Instructions

1.  **Firebase Setup:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Enable Authentication (Email/Password and Google Sign-In).
    *   Obtain your Firebase configuration object.
    *   Replace the placeholder Firebase config in [`scripts/firebase.js`](scripts/firebase.js) with your actual keys.
2.  **Gemini API Key:**
    *   Obtain a Gemini API key from Google AI Studio.
    *   **Important:** For production, implement a backend to securely handle the API key.  For development, you can place the API key in [`scripts/ai.js`](scripts/ai.js), but be aware of the security implications.
3.  **Install Dependencies:**
    *   No Node.js or npm is required as the project is purely front-end.
4.  **Run the Application:**
    *   Open `index.html` in your browser.

## Security Considerations

*   **API Key:** The current implementation exposes the Gemini API key in the client-side code ([`scripts/ai.js`](scripts/ai.js)). This is **not recommended** for production environments. Implement a backend server to proxy requests to the Gemini API and securely manage the API key.
*   **Firebase Configuration:** Ensure your Firebase project is properly configured with appropriate security rules.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

[License] - Add License
