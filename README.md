# 🍎 Food AI Detector: Fruit, Grain & Dairy Classifier

![Project Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![Flask](https://img.shields.io/badge/Flask-Framework-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

**Food AI Detector** is an interactive **Computer Vision** web application designed to classify food in real-time. The system utilizes a Convolutional Neural Network (CNN) to distinguish between **Fruits, Grains, and Dairy**, offering a gamified user experience with immediate visual and auditory feedback.

---

## 👥 Contributors and Development
This project is the result of a collaborative effort focused on integrating Deep Learning models into productive web environments.

* **LuisMalte** - [GitHub Profile](https://github.com/LuisMalte)
* **Witness2005** - [GitHub Profile](https://github.com/Witness2005)

---

## 🧠 The Project's "Brain": Model.h5

The core intelligence of this application resides in the `model.h5` file.

### What is this file?
It is a container in **HDF5** (Hierarchical Data Format) format that stores the complete architecture of our Neural Network, its layers, and most importantly: the **trained weights**. This allows the application to perform instantaneous inferences (predictions) without the need to retrain the system with every use.

### Model Origin
The training, data preprocessing, and model validation were performed in a separate environment to ensure project modularity. You can view the training source code, accuracy metrics, and the dataset used at the following link:

🔗 **[View Training and Data Science Repository Here](https://github.com/LuisMalte/Modelo_Detector_Alimentos)**

---

## 📽️ System Demonstration

The application features two main operating modes. Below is a demonstration of the model's responsiveness in both scenarios:

### 1. Analysis via File Upload
*Processing of static images (JPG, PNG, WebP) from local storage.*

https://youtu.be/f0RX_z_p7lI

### 2. Real-Time Analysis (Camera)
*Integration with the browser API for instantaneous capture and prediction.*

https://youtu.be/fILP76t46Rg

---

## 🚀 Key Features

* **Multi-class Detection:** Accurate classification among three distinct food categories.
* **Hardware Integration:** Use of the `navigator.mediaDevices` API for direct access to the device's camera (mobile or desktop).
* **Sensory Feedback:**
    * **Visual:** Particle effects (emoji/image rain) corresponding to the detected class.
    * **Auditory:** Playback of thematic audio tracks upon a successful prediction.
* **Glassmorphism Interface:** Modern design using transparencies and blurs (CSS backdrop-filter).
* **SPA Feel:** Seamless navigation between "Camera" and "Upload" tabs without page reloads, by dynamically manipulating the DOM.

---

## 🛠️ Tech Stack

### Backend (Python)
* **Flask:** Lightweight web server to expose the `/predict` REST API.
* **TensorFlow / Keras:** Loading the `model.h5` model and executing the computational graph.
* **Pillow (PIL):** Image preprocessing (resizing to 128x128px and color channel conversion).
* **NumPy:** Matrix manipulation to normalize inputs ($\frac{pixel}{255}$).

### Frontend (Web)
* **JavaScript (ES6):** Asynchronous logic (`async/await`) for communication with the backend via `fetch`.
* **Bootstrap 5:** Responsive grid system and components.
* **HTML5 Canvas:** Capturing video frames to convert them into sendable data blobs.

---

## 📂 Project Structure

```bash
├── api.py              # Flask Application (Entry point and Routes)
├── model.h5            # AI Model (Weights and Architecture - Imported)
├── labels.txt          # Readable classes: [fruit, grain, dairy]
├── requirements.txt    # Python environment dependencies
├── wsgi.py             # Deployment configuration (Gunicorn/uWSGI)
├── static/             # Frontend resources
│   ├── audio/          # Sound feedback
│   ├── img/            # Graphic assets
│   ├── js/app.js       # Client logic (Camera, AJAX, DOM)
│   └── css/style.css   # Custom styles
└── templates/
    ├── index.html      # Main interface
    └── ayuda.html      # User guide
