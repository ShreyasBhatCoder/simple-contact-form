const fileInput = document.getElementById('file-upload');
const uploadArea = document.querySelector('.upload-area');
const fileListContainer = document.getElementById('file-list-container');
const locationLink = document.querySelector("#location a");

const locationText = locationLink.innerText.split(' ').join("%20");
locationLink.href = `https://www.google.com/maps/search/?api=1&query=${locationText}`;


// Store selected files in an array
let selectedFiles = [];
let totalFileSize = 0;

// 1. Define the icons cleanly in one place
const ICONS = {
    image: 'image',
    pdf: 'picture_as_pdf',
    zip: 'folder_zip',
    spreadsheet: 'table_chart',
    doc: 'description',
    fallback: 'insert_drive_file'
};

// 2. Map types to their respective icon key
const fileTypeRegistry = {
    // Images
    '.jpg': ICONS.image, '.jpeg': ICONS.image, '.png': ICONS.image,
    'image/jpeg': ICONS.image, 'image/png': ICONS.image,

    // PDF
    '.pdf': ICONS.pdf, 'application/pdf': ICONS.pdf,

    // ZIP
    '.zip': ICONS.zip, 'application/zip': ICONS.zip, 'application/x-zip-compressed': ICONS.zip,

    // Spreadsheets
    '.csv': ICONS.spreadsheet, 'text/csv': ICONS.spreadsheet,
    '.xls': ICONS.spreadsheet, '.xlsx': ICONS.spreadsheet,
    'application/vnd.ms-excel': ICONS.spreadsheet,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ICONS.spreadsheet,

    // Word Docs
    '.doc': ICONS.doc, '.docx': ICONS.doc,
    'application/msword': ICONS.doc,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ICONS.doc
};



// 1. Listen for standard click-to-browse changes
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// 2. Drag & Drop Visual Effects
['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.backgroundColor = '#f5f3ff';
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#c7d2fe';
        uploadArea.style.backgroundColor = 'var(--bg-color)';
    }, false);
});

// 3. Handle Dropped Files
uploadArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
});

function getFileIcon(file) {
    if (!file) return ICONS.fallback;

    // O(1) Fast path: Direct MIME type lookup (e.g., "application/pdf")
    if (file.type && fileTypeRegistry[file.type]) {
        return fileTypeRegistry[file.type];
    }

    // Fallback path: Extract and check file extension (e.g., ".pdf")
    const lastDot = file.name.lastIndexOf('.');
    if (lastDot !== -1) {
        const ext = file.name.slice(lastDot).toLowerCase();
        if (fileTypeRegistry[ext]) {
            return fileTypeRegistry[ext];
        }
    }

    return ICONS.fallback;
}


// 4. Process and Save Files
function handleFiles(files) {
    // Convert FileList to Array and add to our tracking array
    const filesArray = Array.from(files);

    filesArray.forEach(file => {
        // Optional: Format file size to human readable text
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        console.log(file.type);

        // Check if adding this file exceeds the 10MB limit
        if (totalFileSize + parseFloat(sizeInMB) > 10) {
            alert("File size exceeds the 10MB limit");
            return; // Stop processing this file
        }

        totalFileSize += parseFloat(sizeInMB);

        // Create custom file object with unique ID
        const fileObj = {
            id: Symbol('file_id'),
            icon: getFileIcon(file),
            name: file.name,
            size: `${sizeInMB} MB`,
            nativeFile: file
        };

        selectedFiles.push(fileObj);
    });

    updateUI();
}

// 5. Render list and handle deletions
function updateUI() {
    fileListContainer.innerHTML = ''; // Clear container

    selectedFiles.forEach((fileObj) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.style.marginBottom = '8px'; // Minor spacing fix

        // Fetch the file icon
        const fileIcon = document.createElement('span');
        fileIcon.className = 'material-symbols-outlined file-icon';
        fileIcon.innerText = fileObj.icon;

        fileItem.appendChild(fileIcon);

        const fileInfo = document.createElement("div");
        fileInfo.className = "file-info";
        fileInfo.innerHTML = `
        <span class="file-name">${fileObj.name}</span>
        <span class="file-size">${fileObj.size}</span>
        `;

        fileItem.appendChild(fileInfo);


        // Create the delete button dynamically
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.setAttribute('aria-label', 'Remove file');
        removeBtn.innerHTML = '✕';


        // Delete handling logic
        removeBtn.addEventListener('click', () => {
            selectedFiles = selectedFiles.filter(item => item.id !== fileObj.id);
            updateUI(); // Re-render list
        });

        fileItem.appendChild(removeBtn);
        fileListContainer.appendChild(fileItem);
    });
}


(() => {
    const forms = document.querySelectorAll("form");

    Array.from(forms).forEach(form => {
        const validateField = (target) => {
            if (target.id === 'website') {
                const val = target.value.trim();
                // Validates domain formats with or without protocol (e.g., example.com, https://example.com/path)
                const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/;
                if (val !== '' && !urlRegex.test(val)) {
                    target.setCustomValidity("Please enter a valid website URL.");
                } else {
                    target.setCustomValidity("");
                }
            }

            if (!target.willValidate) return;

            if (target.checkValidity()) {
                target.classList.remove("is-invalid");
                // Only invalid message required - do not add green is-valid tick
                target.classList.remove("is-valid");
            } else {
                target.classList.remove("is-valid");
                target.classList.add("is-invalid");
            }
        };

        form.addEventListener("input", event => {
            validateField(event.target);
        });

        form.addEventListener("change", event => {
            validateField(event.target);
        });

        form.addEventListener('submit', event => {
            // Validate all fields including custom validations like website before checking validity
            Array.from(form.elements).forEach(element => {
                validateField(element);
            });

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();

                // Highlight all invalid controls on submit attempt
                Array.from(form.elements).forEach(element => {
                    if (element.willValidate && !element.checkValidity()) {
                        element.classList.add("is-invalid");
                    }
                });
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

// Global toggle theme function called by .theme-switch
function toggleTheme() {
    const isDark = document.body.classList.contains('dark-mode') || document.body.getAttribute('data-theme') === 'dark';
    const themeIcon = document.querySelector('.theme-switch .material-symbols-outlined');

    if (isDark) {
        document.body.classList.remove('dark-mode');
        document.body.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = 'light_mode';
    } else {
        document.body.classList.add('dark-mode');
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = 'dark_mode';
    }
}