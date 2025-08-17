<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1d1c1d;
  min-height: 100vh;
  background: #ffffff;
}

body {
  margin: 0;
  padding: 0;
  background: #ffffff;
}

/* Slack theme color overrides */
* {
  color: #1d1c1d !important;
}

h1, h2, h3, h4, h5, h6 {
  color: #1d1c1d !important;
  font-weight: 700;
}

/* Slack-style button styling */
.p-button {
  font-weight: 600;
  color: #1d1c1d !important;
  background: #ffffff !important;
  border: 1px solid #d1d9df !important;
  border-radius: 8px !important;
  font-size: 14px !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
}

.p-button:hover {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
  border-color: #868686 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
}

.p-button:active {
  background: #e8e8e8 !important;
  color: #1d1c1d !important;
  border-color: #868686 !important;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1) !important;
}

.p-button:focus {
  box-shadow: 0 0 0 3px rgba(29, 155, 209, 0.3) !important;
  border-color: #1d9bd1 !important;
}

.p-button-outlined {
  color: #1d1c1d !important;
  border: 1px solid #d1d9df !important;
  background: #ffffff !important;
}

.p-button-outlined:hover {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
  border-color: #868686 !important;
}

.p-button-outlined:active {
  background: #e8e8e8 !important;
  color: #1d1c1d !important;
}

.p-button-text {
  color: #1d1c1d !important;
  background: transparent !important;
  border: none !important;
}

.p-button-text:hover {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
}

.p-button-text:active {
  background: #e8e8e8 !important;
  color: #1d1c1d !important;
}

/* Primary green button (like Slack's send button) */
.p-button-success {
  background: #007a5a !important;
  color: #ffffff !important;
  border-color: #007a5a !important;
}

.p-button-success:hover {
  background: #148567 !important;
  color: #ffffff !important;
  border-color: #148567 !important;
}

/* Slack-style cards */
.p-card {
  border-radius: 8px !important;
  border: 1px solid #e5e5e5 !important;
  background: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
  outline: none !important;
}

.p-card .p-card-header {
  padding: 20px 24px 0 24px !important;
  background: #ffffff !important;
  border: none !important;
  border-bottom: none !important;
}

.p-card .p-card-content {
  padding: 20px 24px 24px 24px !important;
  background: #ffffff !important;
  border: none !important;
}

/* Override any card-specific classes that might add borders */
.stat-card,
.knowledge-card,
.quick-actions-card,
.recent-activity-card {
  border: 1px solid #e5e5e5 !important;
  outline: none !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
  background: #ffffff !important;
}

/* Slack-style input styling */
.p-inputtext {
  border-radius: 6px !important;
  border: 1px solid #d1d9df !important;
  padding: 12px 14px !important;
  font-size: 14px !important;
  background: #ffffff !important;
  color: #1d1c1d !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
}

.p-inputtext:hover {
  border-color: #868686 !important;
  background: #ffffff !important;
}

.p-inputtext:focus {
  border-color: #1d9bd1 !important;
  box-shadow: 0 0 0 3px rgba(29, 155, 209, 0.15) !important;
  background: #ffffff !important;
  color: #1d1c1d !important;
}

.p-password input {
  background: #ffffff !important;
  border: 1px solid #d1d9df !important;
  color: #1d1c1d !important;
  border-radius: 6px !important;
  padding: 12px 14px !important;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04) !important;
}

.p-password input:hover {
  border-color: #868686 !important;
  background: #ffffff !important;
}

.p-password input:focus {
  border-color: #1d9bd1 !important;
  box-shadow: 0 0 0 3px rgba(29, 155, 209, 0.15) !important;
  background: #ffffff !important;
  color: #1d1c1d !important;
}

.p-inputgroup-addon {
  border: 1px solid #d1d9df !important;
  background: #f8f8f8 !important;
  color: #616061 !important;
  border-radius: 6px 0 0 6px !important;
}

.p-inputgroup-addon:hover {
  background: #e8e8e8 !important;
  color: #616061 !important;
  border-color: #868686 !important;
}

/* Dropdown styling with states */
.p-dropdown {
  border-radius: 6px;
  border: 1px solid #f3f4f6;
  background: #ffffff;
  color: #374151 !important;
}

.p-dropdown:hover {
  border-color: #e5e7eb !important;
  background: #ffffff !important;
}

.p-dropdown:focus {
  border-color: #d1d5db !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
  background: #ffffff !important;
}

.p-dropdown-item {
  color: #374151 !important;
  background: #ffffff !important;
}

.p-dropdown-item:hover {
  background: #f9fafb !important;
  color: #1f2937 !important;
}

/* Data table styling */
.p-datatable {
  background: #ffffff;
  border: none;
}

.p-datatable .p-datatable-thead > tr > th {
  background: #fafafa;
  border-color: #f3f4f6;
  color: #374151 !important;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.p-datatable .p-datatable-thead > tr > th:hover {
  background: #f3f4f6 !important;
  color: #374151 !important;
}

.p-datatable .p-datatable-tbody > tr {
  border-color: #f9fafb;
  background: #ffffff;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background: #fafafa !important;
}

.p-datatable .p-datatable-tbody > tr > td {
  color: #374151 !important;
}

.p-datatable .p-datatable-tbody > tr:hover > td {
  color: #1f2937 !important;
}

.p-toast .p-toast-message {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  border: none;
}

.p-sidebar {
  background: #ffffff;
  border-right: 1px solid #f3f4f6;
}

.p-menubar {
  background: #ffffff;
  border-bottom: 1px solid #f3f4f6;
  border: none;
}

/* Menu styling with comprehensive states */
.p-menu {
  background: #ffffff !important;
  border: none !important;
}

.p-menu .p-menuitem-link {
  color: #616061 !important;
  background: #ffffff !important;
}

.p-menu .p-menuitem-link:hover {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
}

.p-menu .p-menuitem-link:active {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
}

.p-menu .p-menuitem-link:focus {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
  box-shadow: none !important;
}

.p-menu .p-menuitem-icon {
  color: #616061 !important;
}

.p-menu .p-menuitem-link:hover .p-menuitem-icon {
  color: #1d1c1d !important;
}

.p-menu .p-menuitem-link:active .p-menuitem-icon {
  color: #1d1c1d !important;
}

.p-dialog {
  background: #ffffff;
  border: none;
}

.p-dialog .p-dialog-header {
  background: #ffffff;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937 !important;
}

.p-dialog .p-dialog-content {
  background: #ffffff;
}

.p-divider {
  border-color: #f3f4f6;
}

.p-divider.p-divider-horizontal:before {
  border-top-color: #f3f4f6;
}

/* Force all text to use Slack-style colors */
p, span, div, label, small {
  color: #1d1c1d !important;
}

/* Override any remaining black colors */
.text-black {
  color: #1d1c1d !important;
}

/* Comprehensive icon styling with states */
.pi {
  color: #616061 !important;
}

button:hover .pi {
  color: #1d1c1d !important;
}

.p-button:hover .pi {
  color: #1d1c1d !important;
}

.p-menuitem-link:hover .pi {
  color: #1d1c1d !important;
}

/* Remove any black borders and override states */
* {
  border-color: #f3f4f6 !important;
}

*:hover {
  border-color: #e5e7eb !important;
}

*:focus {
  border-color: #d1d5db !important;
}

*:active {
  border-color: #d1d5db !important;
}

/* Links styling */
a {
  color: #374151 !important;
  text-decoration: none !important;
}

a:hover {
  color: #1f2937 !important;
  text-decoration: none !important;
}

a:active {
  color: #1f2937 !important;
}

/* Override any component active states */
.p-component:active {
  color: #1f2937 !important;
}

/* File upload component */
.p-fileupload {
  background: #ffffff !important;
  border-color: #f3f4f6 !important;
}

.p-fileupload .p-fileupload-buttonbar {
  background: #ffffff !important;
  border-color: #f3f4f6 !important;
}

.p-fileupload .p-fileupload-content {
  background: #ffffff !important;
  color: #374151 !important;
}

/* Tag component */
.p-tag {
  background: #f3f4f6 !important;
  color: #374151 !important;
}

/* Calendar and date picker components */
.p-calendar {
  background: #ffffff !important;
  border-color: #f3f4f6 !important;
  color: #374151 !important;
}

.p-calendar:hover {
  border-color: #e5e7eb !important;
}

.p-calendar .p-datepicker {
  background: #ffffff !important;
  border-color: #f3f4f6 !important;
}

.p-calendar .p-datepicker .p-datepicker-header {
  background: #ffffff !important;
  color: #374151 !important;
}

.p-calendar .p-datepicker .p-datepicker-calendar td span {
  color: #374151 !important;
}

.p-calendar .p-datepicker .p-datepicker-calendar td span:hover {
  background: #f9fafb !important;
  color: #1f2937 !important;
}

/* Override any remaining specific component states */
.p-selectbutton .p-button {
  background: #ffffff !important;
  color: #374151 !important;
  border-color: #e5e7eb !important;
}

.p-selectbutton .p-button:hover {
  background: #f9fafb !important;
  color: #1f2937 !important;
}

.p-selectbutton .p-button.p-highlight {
  background: #f3f4f6 !important;
  color: #1f2937 !important;
}

/* Checkbox and radio styling */
.p-checkbox .p-checkbox-box {
  background: #ffffff !important;
  border-color: #e5e7eb !important;
}

.p-checkbox .p-checkbox-box:hover {
  border-color: #d1d5db !important;
}

.p-radiobutton .p-radiobutton-box {
  background: #ffffff !important;
  border-color: #e5e7eb !important;
}

.p-radiobutton .p-radiobutton-box:hover {
  border-color: #d1d5db !important;
}

/* Textarea styling */
.p-inputtextarea {
  background: #ffffff !important;
  border-color: #f3f4f6 !important;
  color: #374151 !important;
}

.p-inputtextarea:hover {
  border-color: #e5e7eb !important;
}

.p-inputtextarea:focus {
  border-color: #d1d5db !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1) !important;
}

/* Progressbar */
.p-progressbar {
  background: #f3f4f6 !important;
}

/* Splitter */
.p-splitter {
  background: #ffffff !important;
  border-color: #f3f4f6 !important;
}

/* Panel */
.p-panel {
  background: #ffffff !important;
  border-color: #f3f4f6 !important;
}

.p-panel .p-panel-header {
  background: #ffffff !important;
  color: #1f2937 !important;
  border-color: #f3f4f6 !important;
}

.p-panel .p-panel-content {
  background: #ffffff !important;
  color: #374151 !important;
}

/* Fieldset */
.p-fieldset {
  background: #ffffff !important;
  border-color: #f3f4f6 !important;
}

.p-fieldset .p-fieldset-legend {
  background: #ffffff !important;
  color: #1f2937 !important;
}

/* Override specific component hover states that might use black */
.p-component:not(.p-disabled):hover {
  color: #1f2937 !important;
}

/* Ensure no element uses pure black (#000000) or near-black colors */
*[style*="color: #000"],
*[style*="color: black"],
*[style*="color: #000000"],
*[style*="color: rgb(0, 0, 0)"] {
  color: #374151 !important;
}

/* Final catch-all for any remaining black text */
*:not(.pi):not(.p-icon) {
  color: #1d1c1d !important;
}

h1, h2, h3, h4, h5, h6 {
  color: #1d1c1d !important;
}

/* Specific sidebar menu overrides to prevent black text */
.layout-sidebar .p-menu .p-menuitem-link,
.layout-sidebar .p-menu .p-menuitem-link *,
.layout-sidebar .layout-menu .p-menuitem-link,
.layout-sidebar .layout-menu .p-menuitem-link * {
  color: #616061 !important;
}

.layout-sidebar .p-menu .p-menuitem-link:hover,
.layout-sidebar .p-menu .p-menuitem-link:hover *,
.layout-sidebar .layout-menu .p-menuitem-link:hover,
.layout-sidebar .layout-menu .p-menuitem-link:hover * {
  color: #1d1c1d !important;
  background: #f8f8f8 !important;
}

.layout-sidebar .p-menu .p-menuitem-link:active,
.layout-sidebar .p-menu .p-menuitem-link:active *,
.layout-sidebar .layout-menu .p-menuitem-link:active,
.layout-sidebar .layout-menu .p-menuitem-link:active * {
  color: #1d1c1d !important;
  background: #f8f8f8 !important;
}

.layout-sidebar .p-menu .p-menuitem-link:focus,
.layout-sidebar .p-menu .p-menuitem-link:focus *,
.layout-sidebar .layout-menu .p-menuitem-link:focus,
.layout-sidebar .layout-menu .p-menuitem-link:focus * {
  color: #1d1c1d !important;
  background: #f8f8f8 !important;
}

/* Force override any black (#000000) colors */
.layout-sidebar *[style*="color: #000"],
.layout-sidebar *[style*="color: black"],
.layout-sidebar *[style*="color: #000000"],
.layout-sidebar *[style*="color: rgb(0, 0, 0)"],
.layout-sidebar * {
  color: #616061 !important;
}

.layout-sidebar *:hover {
  color: #1d1c1d !important;
}

/* Utility classes */
.text-green-500 { color: #10b981 !important; }
.text-red-500 { color: #ef4444 !important; }
.text-blue-500 { color: #3b82f6 !important; }
.text-gray-400 { color: #9ca3af !important; }
.text-gray-500 { color: #6b7280 !important; }
.text-gray-600 { color: #4b5563 !important; }
.text-gray-700 { color: #374151 !important; }
.text-gray-800 { color: #1f2937 !important; }
.text-gray-900 { color: #111827 !important; }

/* Override the gray-900 to not be too dark */
.text-gray-900 { color: #1f2937 !important; }

/* Nuclear option: Override any possible black borders */
* {
  border: none !important;
}

/* Nuclear option: Override any possible black backgrounds and text */
.layout-sidebar .p-menuitem-link,
.layout-sidebar .p-menuitem-link:hover,
.layout-sidebar .p-menuitem-link:active,
.layout-sidebar .p-menuitem-link:focus,
.layout-sidebar .p-menuitem-link:visited {
  background: #ffffff !important;
  color: #616061 !important;
}

.layout-sidebar .p-menuitem-link:hover {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
}

.layout-sidebar .p-menuitem-link:active,
.layout-sidebar .p-menuitem-link:focus {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
}

/* Override any PrimeVue generated styles */
.layout-sidebar .p-menu .p-menuitem .p-menuitem-content .p-menuitem-link,
.layout-sidebar .p-menu .p-menuitem .p-menuitem-content .p-menuitem-link:hover,
.layout-sidebar .p-menu .p-menuitem .p-menuitem-content .p-menuitem-link:active,
.layout-sidebar .p-menu .p-menuitem .p-menuitem-content .p-menuitem-link:focus {
  background: #f8f8f8 !important;
  color: #1d1c1d !important;
}

/* Force all sidebar elements to never be black */
.layout-sidebar,
.layout-sidebar *,
.layout-sidebar *:before,
.layout-sidebar *:after {
  color: #616061 !important;
  background-color: #ffffff !important;
}

.layout-sidebar *:hover,
.layout-sidebar *:hover:before,
.layout-sidebar *:hover:after {
  color: #1d1c1d !important;
  background-color: #f8f8f8 !important;
}

/* Nuclear option: Eliminate ALL black backgrounds everywhere */
*,
*:before,
*:after {
  background-color: #ffffff !important;
}

/* Allow only specific light backgrounds */
.p-inputtext,
.p-dropdown,
.p-calendar,
.p-button:hover,
.p-inputtext:hover,
.p-dropdown:hover,
.layout-sidebar *:hover,
.p-menuitem-link:hover,
.p-datatable .p-datatable-tbody > tr:hover {
  background-color: #f8f8f8 !important;
}

.p-inputgroup-addon {
  background-color: #f8f8f8 !important;
}

.p-card {
  background-color: #ffffff !important;
}

/* Ensure main content areas are white */
.layout-content,
.layout-main,
.layout-topbar {
  background-color: #ffffff !important;
}

/* Override any possible black/dark backgrounds */
div[style*="background: #"],
div[style*="background-color: #"],
*[style*="background: black"],
*[style*="background-color: black"],
*[style*="background: #000"],
*[style*="background-color: #000"] {
  background-color: #ffffff !important;
}

/* Add back only the borders we want (light gray) */
.p-inputtext,
.p-password input,
.p-dropdown,
.p-inputgroup-addon,
.p-calendar {
  border: 1px solid #f3f4f6 !important;
}

.p-inputtext:hover,
.p-password input:hover,
.p-dropdown:hover,
.p-calendar:hover {
  border: 1px solid #e5e7eb !important;
}

.p-inputtext:focus,
.p-password input:focus,
.p-dropdown:focus,
.p-calendar:focus {
  border: 1px solid #d1d5db !important;
}

/* Light borders for layout elements */
.layout-sidebar {
  border-right: 1px solid #f3f4f6 !important;
}

.layout-topbar {
  border-bottom: 1px solid #f3f4f6 !important;
}

.sidebar-header {
  border-bottom: 1px solid #f3f4f6 !important;
}

.sidebar-footer {
  border-top: 1px solid #f3f4f6 !important;
}

/* Table borders */
.p-datatable .p-datatable-thead > tr > th,
.p-datatable .p-datatable-tbody > tr > td {
  border: 1px solid #f3f4f6 !important;
}

/* Dialog borders */
.p-dialog .p-dialog-header {
  border-bottom: 1px solid #f3f4f6 !important;
}

/* Divider borders */
.p-divider.p-divider-horizontal:before {
  border-top: 1px solid #f3f4f6 !important;
}

/* Activity item borders */
.activity-item {
  border-bottom: 1px solid #f3f4f6 !important;
}

.activity-item:last-child {
  border-bottom: none !important;
}
</style>
