"use strict";
// Global state
let currentForm = null;
let forms = [];
let responses = [];
// Initialize from localStorage
function initialize() {
    const storedForms = localStorage.getItem('forms');
    const storedResponses = localStorage.getItem('formResponses');
    if (storedForms)
        forms = JSON.parse(storedForms);
    if (storedResponses)
        responses = JSON.parse(storedResponses);
    showFormList();
}
// View management
/**
 * Utility to switch between views
 * @param viewId - The ID of the view to display
 */
function showView(viewId) {
    ['formList', 'formCreator', 'formPreview', 'responsesView'].forEach(id => {
        document.getElementById(id).style.display = id === viewId ? 'block' : 'none';
    });
}
/**
 * Displays the form list view and renders the forms
 */
function showFormList() {
    showView('formList');
    renderFormList();
}
/**
 * Displays the form creation view and initializes a new form
 */
function showCreateForm() {
    showView('formCreator');
    currentForm = {
        id: Date.now().toString(),
        title: '',
        fields: []
    };
    document.getElementById('formTitle').value = '';
    document.getElementById('formFields').innerHTML = '';
}
/**
 * Resets the form creator fields
 */
function resetFormCreator() {
    document.getElementById('formTitle').value = '';
    document.getElementById('formFields').innerHTML = '';
}
/**
 * Adds a new field to the form
 * @param type - The type of field to add
 * @param existingField - Optional existing field to populate
 */
function addField(type, existingField) {
    const field = existingField || {
        id: Date.now().toString(),
        type,
        label: '',
        options: type === 'text' ? undefined : ['Option 1']
    };
    const fieldElement = document.createElement('div');
    fieldElement.className = 'p-4 border rounded';
    fieldElement.innerHTML = `
                <div class="flex justify-between mb-2">
                    <input type="text" placeholder="Question/Label" class="w-full mr-2 p-2 border rounded" 
                           onchange="updateFieldLabel('${field.id}', this.value)" value="${field.label}">
                    <button onclick="removeField('${field.id}')" class="text-red-500">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                ${type !== 'text' ? `
                    <div class="options-container">
                        ${field.options.map((option, index) => `
                            <div class="mb-2">
                                <input type="text" placeholder="Option" class="p-2 border rounded" 
                                       value="${option}" onchange="updateOption('${field.id}', ${index}, this.value)">
                            </div>
                        `).join('')}
                        <button onclick="addOption('${field.id}')" class="text-blue-500">
                            <i class="bi bi-plus-circle"></i> Add Option
                        </button>
                    </div>
                ` : ''}
            `;
    document.getElementById('formFields').appendChild(fieldElement);
    if (!existingField) {
        currentForm.fields.push(field);
    }
}
/**
 * Removes a field from the current form
 * @param fieldId - The ID of the field to remove
 */
function removeField(fieldId) {
    currentForm.fields = currentForm.fields.filter(f => f.id !== fieldId);
    document.getElementById('formFields').innerHTML = '';
    currentForm.fields.forEach(field => addField(field.type));
}
/**
 * Adds a new option to a field
 * @param fieldId - The ID of the field to add an option to
 */
function addOption(fieldId) {
    const field = currentForm.fields.find(f => f.id === fieldId);
    if (field && field.options) {
        field.options.push(`Option ${field.options.length + 1}`);
        const optionsContainer = document.querySelector(`[onclick="removeField('${fieldId}')"]`)
            .closest('.p-4')
            .querySelector('.options-container');
        const optionElement = document.createElement('div');
        optionElement.className = 'mb-2';
        optionElement.innerHTML = `
                    <input type="text" placeholder="Option" class="p-2 border rounded" 
                           value="Option ${field.options.length}" 
                           onchange="updateOption('${fieldId}', ${field.options.length - 1}, this.value)">
                `;
        optionsContainer.insertBefore(optionElement, optionsContainer.lastElementChild);
    }
}
/**
 * Updates the label of a field
 * @param fieldId - The ID of the field to update
 * @param value - The new label value
 */
function updateFieldLabel(fieldId, value) {
    const field = currentForm.fields.find(f => f.id === fieldId);
    if (field)
        field.label = value;
}
/**
 * Updates an option for a field
 * @param fieldId - The ID of the field
 * @param index - The index of the option to update
 * @param value - The new option value
 */
function updateOption(fieldId, index, value) {
    const field = currentForm.fields.find(f => f.id === fieldId);
    if (field && field.options)
        field.options[index] = value;
}
/**
 * Saves the current form
 */
function saveForm() {
    currentForm.title = document.getElementById('formTitle').value;
    if (!currentForm.title.trim()) {
        alert('Please add a form title');
        return;
    }
    if (currentForm.fields.length === 0) {
        alert('Please add at least one field');
        return;
    }
    const formIndex = forms.findIndex(f => f.id === currentForm.id);
    if (formIndex === -1) {
        forms.push(currentForm);
    }
    else {
        forms[formIndex] = currentForm;
    }
    localStorage.setItem('forms', JSON.stringify(forms));
    showFormList();
}
/**
 * Renders the form list
 */
function renderFormList() {
    const container = document.getElementById('formListContainer');
    container.innerHTML = forms.map(form => `
                <div class="bg-white p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">${form.title}</h3>
                    <p class="text-gray-600 mb-4">${form.fields.length} fields</p>
                    <div class="flex gap-2">
                        <button onclick="previewForm('${form.id}')" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            <i class="bi bi-eye"></i> Preview
                        </button>
                        <button onclick="editForm('${form.id}')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button onclick="deleteForm('${form.id}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                        <button onclick="viewResponses('${form.id}')" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                            <i class="bi bi-list-ul"></i> Responses
                        </button>
                    </div>
                </div>
            `).join('');
}
/**
 * Preview a form.
 * @param formId The ID of the form to preview.
 */
function previewForm(formId) {
    currentForm = forms.find(f => f.id === formId);
    showView('formPreview');
    document.getElementById('previewTitle').textContent = currentForm.title;
    const previewFields = document.getElementById('previewFields');
    previewFields.innerHTML = currentForm.fields.map(field => `
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">${field.label}</label>
                    ${field.type === 'text' ? `
                        <input type="text" class="w-full p-2 border rounded" name="${field.id}">
                    ` : field.type === 'radio' ? `
                        <div class="space-y-2">
                            ${field.options.map((option, i) => `
                                <div>
                                    <input type="radio" name="${field.id}" value="${option}" id="${field.id}-${i}">
                                    <label for="${field.id}-${i}">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="space-y-2">
                            ${field.options.map((option, i) => `
                                <div>
                                    <input type="checkbox" name="${field.id}" value="${option}" id="${field.id}-${i}">
                                    <label for="${field.id}-${i}">${option}</label>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            `).join('');
}
/**
 * Submit the responses for a form.
 */
function submitForm() {
    const formResponse = {
        formId: currentForm.id,
        timestamp: Date.now(),
        responses: {}
    };
    currentForm.fields.forEach(field => {
        if (field.type === 'text') {
            const input = document.querySelector(`input[name="${field.id}"]`);
            formResponse.responses[field.id] = input.value;
        }
        else if (field.type === 'radio') {
            const selected = document.querySelector(`input[name="${field.id}"]:checked`);
            formResponse.responses[field.id] = selected ? selected.value : '';
        }
        else {
            const checked = Array.from(document.querySelectorAll(`input[name="${field.id}"]:checked`));
            formResponse.responses[field.id] = checked.map(input => input.value);
        }
    });
    responses.push(formResponse);
    localStorage.setItem('formResponses', JSON.stringify(responses));
    alert('Form submitted successfully!');
    showFormList();
}
/**
 * Edit a form by its ID.
 * @param formId The ID of the form to edit.
 */
function editForm(formId) {
    currentForm = forms.find(f => f.id === formId);
    showView('formCreator');
    document.getElementById('formTitle').value = currentForm.title;
    document.getElementById('formFields').innerHTML = '';
    currentForm.fields.forEach(field => addField(field.type, field));
}
/**
 * Delete a form by its ID.
 * @param formId The ID of the form to delete.
 */
function deleteForm(formId) {
    if (confirm('Are you sure you want to delete this form?')) {
        forms = forms.filter(f => f.id !== formId);
        responses = responses.filter(r => r.formId !== formId);
        localStorage.setItem('forms', JSON.stringify(forms));
        localStorage.setItem('formResponses', JSON.stringify(responses));
        renderFormList();
    }
}
/**
 * View responses for a specific form.
 * @param formId The ID of the form whose responses to view.
 */
function viewResponses(formId) {
    const form = forms.find(f => f.id === formId);
    const formResponses = responses.filter(r => r.formId === formId);
    showView('responsesView');
    const responsesList = document.getElementById('responsesList');
    responsesList.innerHTML = `
                <h3 class="text-lg font-semibold mb-4">${form.title} - Responses</h3>
                ${formResponses.length === 0 ? '<p>No responses yet.</p>' :
        formResponses.map(response => `
                        <div class="bg-gray-50 p-4 rounded mb-4">
                            <p class="text-sm text-gray-500 mb-2">
                                Submitted on ${new Date(response.timestamp).toLocaleString()}
                            </p>
                            ${form.fields.map(field => `
                                <div class="mb-2">
                                    <strong>${field.label}:</strong> 
                                    ${Array.isArray(response.responses[field.id]) ?
            response.responses[field.id].join(', ') :
            response.responses[field.id]}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
            `;
}
// Initialize the application
initialize();
