const fileInput = document.getElementById('file-upload');
const uploadArea = document.querySelector('.upload-area');
const fileListContainer = document.getElementById('file-list-container');

// Store selected files in an array
let selectedFiles = [];

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

// 4. Process and Save Files
function handleFiles(files) {
    // Convert FileList to Array and add to our tracking array
    const filesArray = Array.from(files);

    filesArray.forEach(file => {
        // Optional: Format file size to human readable text
        const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

        // Create custom file object with unique ID
        const fileObj = {
            id: Symbol('file_id'),
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

        fileItem.innerHTML = `
          <div class="file-info">
            <span class="file-name">${fileObj.name}</span>
            <span class="file-size">${fileObj.size}</span>
          </div>
        `;

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