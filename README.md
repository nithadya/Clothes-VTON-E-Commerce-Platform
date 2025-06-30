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
        A -->|HTTP/REST| V[VTON Service]
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
        V5 -->|HTTP Response| A
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

## 🎨 UI Architecture & Design System

### Component Hierarchy
```mermaid
graph TD
    subgraph App[Application Root]
        L[Layout] --> N[Navbar]
        L --> M[Main Content]
        L --> F[Footer]
    end

    subgraph Pages[Main Pages]
        M --> H[Home Page]
        M --> P[Product Catalog]
        M --> T[Try-On Studio]
        M --> C[Cart & Checkout]
        M --> U[User Dashboard]
        M --> A[Admin Panel]
    end

    subgraph Components[Reusable Components]
        style Components fill:#e1f5fe,stroke:#01579b
        B1[Product Card]
        B2[Try-On Widget]
        B3[Size Selector]
        B4[Color Picker]
        B5[Image Upload]
        B6[Loading States]
        B7[Notifications]
    end

    subgraph TryOn[Try-On Studio Components]
        style TryOn fill:#f3e5f5,stroke:#4a148c
        T --> TS[Studio Layout]
        TS --> T1[Camera Input]
        TS --> T2[Image Upload]
        TS --> T3[Product Preview]
        TS --> T4[Try-On Preview]
        TS --> T5[Controls Panel]
    end

    subgraph Admin[Admin Components]
        style Admin fill:#fff3e0,stroke:#e65100
        A --> A1[Dashboard Stats]
        A --> A2[Product Management]
        A --> A3[Order Management]
        A --> A4[User Management]
        A --> A5[Analytics]
    end
```

### Design System

```mermaid
graph TD
    subgraph DesignTokens[Design Tokens]
        style DesignTokens fill:#e8f5e9,stroke:#1b5e20
        C1[Colors] --> CP[Primary]
        C1 --> CS[Secondary]
        C1 --> CN[Neutral]
        C1 --> CE[Error]
        C1 --> CW[Warning]
        C1 --> CSu[Success]

        T1[Typography] --> TH[Headings]
        T1 --> TB[Body]
        T1 --> TL[Labels]
        T1 --> TC[Captions]

        S1[Spacing] --> SP[Padding]
        S1 --> SM[Margins]
        S1 --> SG[Gaps]

        B1[Breakpoints] --> BM[Mobile: 320px]
        B1 --> BT[Tablet: 768px]
        B1 --> BD[Desktop: 1024px]
        B1 --> BL[Large: 1440px]
    end

    subgraph Components[Core Components]
        style Components fill:#f3e5f5,stroke:#4a148c
        Button[Buttons] --> BP[Primary]
        Button --> BS[Secondary]
        Button --> BT[Text]
        Button --> BI[Icon]

        Input[Inputs] --> IF[Text Field]
        Input --> IS[Select]
        Input --> IC[Checkbox]
        Input --> IR[Radio]
        Input --> IU[Upload]

        Card[Cards] --> CP[Product]
        Card --> CO[Order]
        Card --> CA[Analytics]
    end
```

### Page Layouts

```mermaid
graph TD
    subgraph HomeLayout[Home Page]
        style HomeLayout fill:#e3f2fd,stroke:#0d47a1
        H1[Hero Banner]
        H2[Featured Products]
        H3[Categories Grid]
        H4[Trending Items]
        H5[Try-On CTA]
    end

    subgraph TryOnLayout[Try-On Studio]
        style TryOnLayout fill:#fce4ec,stroke:#880e4f
        T1[Split View] --> TL[Left Panel]
        T1 --> TR[Right Panel]
        TL --> TL1[Image Input]
        TL --> TL2[Controls]
        TR --> TR1[Preview]
        TR --> TR2[Product Info]
    end

    subgraph ProductLayout[Product Page]
        style ProductLayout fill:#f1f8e9,stroke:#33691e
        P1[Gallery]
        P2[Product Info]
        P3[Size Guide]
        P4[Try-On Button]
        P5[Related Items]
    end

    subgraph CheckoutLayout[Checkout Flow]
        style CheckoutLayout fill:#fff3e0,stroke:#e65100
        C1[Cart Summary]
        C2[Shipping Info]
        C3[Payment Form]
        C4[Order Review]
    end
```

### Responsive Behavior
```mermaid
graph LR
    subgraph Mobile[Mobile First]
        M1[Single Column]
        M2[Bottom Navigation]
        M3[Hamburger Menu]
    end

    subgraph Tablet[Tablet]
        T1[Two Columns]
        T2[Side Navigation]
        T3[Expanded Menu]
    end

    subgraph Desktop[Desktop]
        D1[Multi Column]
        D2[Top Navigation]
        D3[Mega Menu]
    end

    Mobile --> Tablet
    Tablet --> Desktop
```

### State Management
```mermaid
graph TD
    subgraph GlobalState[Global State]
        G1[User Auth]
        G2[Cart]
        G3[Theme]
        G4[Notifications]
    end

    subgraph LocalState[Component State]
        L1[Form Inputs]
        L2[UI Controls]
        L3[Animations]
    end

    subgraph CacheState[Cache Layer]
        C1[Product Data]
        C2[User Preferences]
        C3[Try-On History]
    end
```

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
- Devnath Jayasekara (jmdevnath@gmail.com)
- Prabhath Subashana (prabhathsubhashana18@gmail.com)

## 📞 Support

For technical support and inquiries, please contact:
- Email: mihisaranithadya@gmail.com
- Project Repository: [GitHub Repository URL]

---

⭐ Don't forget to star this repository if you found it helpful! 

## 🔄 VTON Service Integration

### Service Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant V as VTON Service
    participant M as CP-VTON Model

    U->>F: Select Clothing Item
    U->>F: Upload Person Image
    F->>B: GET /api/products/:id
    B-->>F: Product Details
    F->>V: POST /api/tryon/:productId
    Note over V: Upload person image
    V->>V: Preprocess Images
    V->>M: Process Try-on
    M-->>V: Generate Result
    V-->>F: Return Result URL
    F->>U: Display Result
```

### Technical Implementation
The VTON service (`clothes-vton-service/backend`) implements:

1. **REST API Endpoints**
   ```javascript
   // Product retrieval
   app.get("/api/products/:id", async (req, res) => {
     // Fetch product details
   });

   // Virtual try-on processing
   app.post("/api/tryon/:productId", upload.single("personImage"), async (req, res) => {
     // Process try-on request
   });
   ```

2. **Image Processing Pipeline**
   - Person image preprocessing
   - Product image retrieval
   - Model inference using Gradio client
   - Result post-processing

3. **Error Handling**
   - Input validation
   - Product existence checks
   - Image processing error handling
   - Graceful error responses

### API Endpoints

```typescript
// VTON Service API
GET  /api/products/:id           // Get product details
POST /api/tryon/:productId       // Process virtual try-on
```

### Request/Response Examples

```javascript
// Try-on Request
POST /api/tryon/123
Content-Type: multipart/form-data
Body: {
  personImage: [binary]
}

// Success Response
{
  "outputImageUrl": "https://...",
  "productDetails": {
    "name": "Product Name",
    "image": "https://...",
    "price": 99.99
  }
}
``` 
