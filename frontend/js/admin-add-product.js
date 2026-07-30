// ==========================================
// SAHU ENTERPRISES
// ADD PRODUCT
// ==========================================

const BASE_URL = "https://sahu-enterprises-ecommerce.onrender.com/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// ==========================================
// CHECK LOGIN
// ==========================================

if (!token || !user) {

    alert("Please login first.");

    window.location.href = "../login.html";

}

if (user.role !== "admin") {

    alert("Access Denied");

    window.location.href = "../login.html";

}

// ==========================================
// IMAGE PREVIEW
// ==========================================

const imageInput = document.getElementById("images");
const previewContainer = document.getElementById("image-preview-container");

imageInput.addEventListener("change", function () {

    previewContainer.innerHTML = "";

    const files = this.files;

    if (files.length > 5) {

        alert("You can upload a maximum of 5 images.");

        this.value = "";

        return;

    }

    Array.from(files).forEach(file => {

        const img = document.createElement("img");

        img.src = URL.createObjectURL(file);

        img.style.width = "120px";
        img.style.height = "120px";
        img.style.objectFit = "cover";
        img.style.margin = "10px";
        img.style.borderRadius = "8px";
        img.style.border = "1px solid #ddd";

        previewContainer.appendChild(img);

    });

});

// ==========================================
// ADD PRODUCT
// ==========================================

document
    .getElementById("add-product-form")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData();

        formData.append(
            "name",
            document.getElementById("name").value.trim()
        );

        formData.append(
            "description",
            document.getElementById("description").value.trim()
        );

        formData.append(
            "category",
            document.getElementById("category").value
        );

        formData.append(
            "price",
            document.getElementById("price").value
        );

        formData.append(
            "stock",
            document.getElementById("stock").value
        );

        formData.append(
            "isFeatured",
            document.getElementById("featured").checked
        );

        formData.append(
            "isActive",
            true
        );

        const imageFiles = document.getElementById("images").files;

        if (imageFiles.length === 0) {

            alert("Please select at least one image.");

            return;

        }

        for (let i = 0; i < imageFiles.length; i++) {

            formData.append("images", imageFiles[i]);

        }

        try {

            const response = await fetch(`${BASE_URL}/products`, {

                method: "POST",

                headers: {

                    Authorization: `Bearer ${token}`

                },

                body: formData

            });

            const data = await response.json();

            if (!response.ok) {

                alert(data.message || "Unable to add product.");

                return;

            }

            alert("Product Added Successfully!");

            window.location.href = "products.html";

        } catch (error) {

            console.error("Add Product Error:", error);

            alert("Unable to add product.");

        }

    });