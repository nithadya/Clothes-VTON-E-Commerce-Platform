# Virtual Try-On E-Commerce Platform 🛍️

A cutting-edge e-commerce platform featuring AI-powered virtual try-on technology for clothing. This system allows users to virtually try on clothes before making a purchase, revolutionizing the online shopping experience.

## 🌟 Key Features

- 🤖 AI-Powered Virtual Try-On
- 👕 Real-time Clothing Visualization
- 🛒 Full E-commerce Functionality
- 👤 User Profile Management
- 🎯 Personalized Recommendations
- 📱 Responsive Design
- 🔐 Secure Authentication
- 💳 Payment Integration
- 📊 Admin Dashboard

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client[Client Layer]
        A[Web Frontend] -->|HTTP/REST| B[Backend API]
        A -->|WebSocket| V[VTON Service]
    end

    subgraph Backend[Backend Services]
        B -->|Data Management| C[(Database)]
        B -->|Authentication| D[Auth Service]
        B -->|Product Management| E[Product Service]
        B -->|User Management| F[User Service]
        B -->|Admin Access| G[Admin Panel]
        H[Payment Gateway] -->|Transaction| B
    end

    subgraph VTON[VTON Service Layer]
        V -->|Image Processing| V1[Image Preprocessor]
        V1 -->|Person Parsing| V2[Human Parser]
        V1 -->|Cloth Masking| V3[Cloth Mask Generator]
        V2 & V3 --> V4[CP-VTON Model]
        V4 -->|Result| V5[Post Processor]
        V5 -->|WebSocket| A
    end

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style Backend fill:#bbf,stroke:#333,stroke-width:2px
    style VTON fill:#bfb,stroke:#333,stroke-width:2px
```

## 🤖 AI Architecture - Virtual Try-On Model

```mermaid
graph LR
    A[Input Image] --> B[Feature Extraction]
    C[Clothing Item] --> D[Cloth Feature Extraction]
    B --> E[Pose Estimation]
    D --> F[Cloth Warping]
    E --> G[Try-On Generation]
    F --> G
    G --> H[Final Output]
```

## 🔬 CP-VTON Model References

### Research Papers

1. **CP-VTON: Characteristic-Preserving Virtual Try-On Network**
   - Authors: Bochao Wang, Huabin Zheng, Xiaodan Liang, Yimin Chen, Liang Lin, Meng Yang
   - Published: ECCV 2018
   - DOI: [10.1007/978-3-030-01216-8_37](https://doi.org/10.1007/978-3-030-01216-8_37)
   - [Paper Link](https://arxiv.org/abs/1807.07688)

2. **CP-VTON+: Clothing Shape and Texture Preserving Image-Based Virtual Try-On**
   - Authors: Matiur Rahman Minar, Thai Thanh Tuan, Heejune Ahn, Paul Rosin, Yu-Kun Lai
   - Published: CVPRW 2020
   - [Paper Link](https://arxiv.org/abs/2004.07378)

### Key Components

1. **Geometric Matching Module (GMM)**
   - Predicts a Thin-Plate Spline (TPS) transformation
   - Warps the clothing item to align with the target person's pose
   - Preserves clothing characteristics during warping

2. **Try-on Module (TOM)**
   - Generates the final try-on result
   - Renders the warped clothing on the person
   - Handles occlusions and preserves details

### Model Architecture Details

```mermaid
graph TD
    A[Input Person Image] --> B[Person Feature Extraction]
    C[Input Clothing] --> D[Clothing Feature Extraction]
    B & D --> E[Geometric Matching Module]
    E --> F[TPS Transformation]
    F --> G[Try-on Module]
    G --> H[Final Try-on Result]
    
    subgraph GMM[Geometric Matching Module]
    E --> I[Correlation Matrix]
    I --> J[TPS Parameters]
    end
    
    subgraph TOM[Try-on Module]
    G --> K[Composition Mask]
    K --> L[Rendered Result]
    end
```

### Dataset References

1. **VITON Dataset**
   - 19,000 image pairs
   - Front-view women images
   - Resolution: 256 x 192
   - [Dataset Link](https://vision.cs.ubc.ca/datasets/fashion/)

2. **MPV Dataset**
   - Multi-Pose Virtual Try-on
   - 35,687 person images
   - 13,524 clothing items
   - Multiple poses and views

### Implementation Details

Our implementation uses the following key improvements:

1. **Enhanced Pre-processing**
   - Human parsing using [Self-Correction Human Parsing](https://github.com/PeikeLi/Self-Correction-Human-Parsing)
   - Pose estimation using OpenPose
   - Cloth mask extraction using U2NET

2. **Model Enhancements**
   - Second-order difference constraint for TPS
   - Multi-stage refinement strategy
   - Improved loss functions:
     - VGG perceptual loss
     - Style loss
     - Content loss

3. **Training Configuration**
   - Batch size: 4
   - Learning rate: 0.0001
   - Optimizer: Adam
   - Epochs: 200

### Citation

```bibtex
@inproceedings{wang2018cp,
  title={Toward Characteristic-Preserving Image-based Virtual Try-On Network},
  author={Wang, Bochao and Zheng, Huabin and Liang, Xiaodan and Chen, Yimin and Lin, Liang and Yang, Meng},
  booktitle={ECCV},
  year={2018}
}

@inproceedings{minar2020cp,
  title={CP-VTON+: Clothing Shape and Texture Preserving Image-Based Virtual Try-On},
  author={Minar, Matiur Rahman and Tuan, Thai Thanh and Ahn, Heejune and Rosin, Paul and Lai, Yu-Kun},
  booktitle={The IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR) Workshops},
  year={2020}
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- GPU (recommended for VTON service)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd Clothes-VTON-E-Commerce-Platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Admin Panel Setup**
   ```bash
   cd admin_panel
   npm install
   npm start
   ```

5. **VTON Service Setup**
   ```bash
   cd clothes-vton-service
   pip install -r requirements.txt
   python app.py
   ```

## 🔧 Technology Stack

- **Frontend**: React.js, Vite, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Model**: PyTorch, TensorFlow
- **Authentication**: JWT
- **Real-time Communication**: WebSocket
- **Payment Processing**: Stripe

## 📸 Screenshots

[Place screenshots here]

### Home Page
![Home Page]

### Virtual Try-On Interface
![Try-On Interface]

### Product Catalog
![Product Catalog]

### Admin Dashboard
![Admin Dashboard]

## 🔐 Security Features

- JWT Authentication
- Secure Payment Processing
- Data Encryption
- CORS Protection
- Input Validation
- Rate Limiting

## 🎯 Future Enhancements

- [ ] Mobile App Development
- [ ] AR Integration
- [ ] Multi-language Support
- [ ] Advanced Analytics Dashboard
- [ ] AI-powered Size Recommendations
- [ ] Social Media Integration

## 📄 License

MIT License

Copyright (c) 2024 Virtual Try-On E-Commerce Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 👥 Contributors

- Mihisara Nithadya (mihisaranithadya@gmail.com)
- [Contributor 2]
- [Contributor 3]

## 📞 Support

For technical support and inquiries, please contact:
- Email: mihisaranithadya@gmail.com
- Project Repository: [GitHub Repository URL]

---

⭐ Don't forget to star this repository if you found it helpful! 