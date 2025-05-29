import { NicheConfig } from "./niche.config.base";
import { FormFieldType, FormDefinition } from "../interfaces/forms"; // Ensure correct path

export const doorsWindowsNicheConfig: NicheConfig = {
  nicheNameSingular: "Doors & Windows Product",
  nicheNamePlural: "Doors & Windows Products",
  itemDisplayNameKey: "productName", // Assuming items will have a 'productName'

  itemDefinition: {
    fields: [
      { key: "productName", label: "Product Name", isSearchable: true, displayInCard: true, displayInDetail: true },
      { key: "material", label: "Material", isFilterable: true, displayInDetail: true },
      { key: "style", label: "Style", isFilterable: true, displayInDetail: true },
      { key: "priceRange", label: "Price Range", displayInCard: true, displayInDetail: true },
      { key: "description", label: "Description", isSearchable: true, displayInDetail: true },
      { key: "image", label: "Image", displayInCard: true, displayInDetail: true },
    ],
  },

  seo: {
    titleTemplate: "Find {query} {nicheNamePlural} | Quality Doors & Windows",
    descriptionTemplate: "Browse our selection of high-quality {query} {nicheNamePlural}.",
    itemDetailTitleTemplate: "{itemName} - {nicheNameSingular}",
    itemDetailDescriptionTemplate: "Details for {itemName}, a quality {nicheNameSingular}. Material: {material}, Style: {style}.",
  },

  searchConfig: {
    searchableFields: ["productName", "description", "material", "style"],
    primarySearchPlaceholder: "Search for doors, windows, materials...",
    locationSearchable: false, // Typically not location-specific for product browsing
    filterByFields: [
      { key: "material", label: "Materials" },
      { key: "style", label: "Styles" },
      { key: "priceRange", label: "Price Ranges" },
    ],
  },

  schemaOrg: { // Minimal Schema.org for a Product
    type: "Product",
    propertyMappings: [
      { itemKey: "productName", schemaProperty: "name" },
      { itemKey: "description", schemaProperty: "description" },
      { itemKey: "image", schemaProperty: "image" },
      // Potentially add mappings for brand, material, etc. if those keys exist in item data
    ],
  },

  assets: {
    // homeBannerImage: "/assets/doors-windows-banner.jpg", // Example, if one exists
    logo: "/assets/doors-windows-logo.png", // Example
  },

  theme: {
    primaryColor: "#005A9C",   // A sturdy blue
    secondaryColor: "#7B8794", // A metallic grey
  },

  leadGenForm: {
    id: "doors-windows-quote-v1",
    nicheName: "doors-windows", // Matches the niche
    title: "Request a Quote for Doors & Windows",
    description: "Fill out the form below to get a customized quote for your project.",
    steps: [
      {
        title: "Step 1: Product & Service",
        description: "Tell us what you're looking for.",
        fields: [
          { 
            name: "productType", 
            label: "Product Type", 
            type: FormFieldType.Select, 
            options: [
              {value: "windows", label: "Windows"}, 
              {value: "doors", label: "Doors"}, 
              {value: "both", label: "Both Windows & Doors"}
            ], 
            validations: { required: true },
            helperText: "Select the type of product you are interested in."
          },
          { 
            name: "serviceRequired", 
            label: "Service Required", 
            type: FormFieldType.Radio, // Changed to Radio for better UX for few options
            options: [
              {value: "installation", label: "New Installation"}, 
              {value: "replacement", label: "Replacement"}, 
              {value: "repair", label: "Repair"}
            ], 
            validations: { required: true },
            defaultValue: "installation",
          },
          {
            name: "materialPreference",
            label: "Material Preference (Optional)",
            type: FormFieldType.Select,
            options: [
              {value: "vinyl", label: "Vinyl"},
              {value: "wood", label: "Wood"},
              {value: "aluminum", label: "Aluminum"},
              {value: "fiberglass", label: "Fiberglass"},
              {value: "any", label: "No Preference / Unsure"},
            ],
            placeholder: "Select a material",
          },
        ],
      },
      {
        title: "Step 2: Project Details",
        description: "Provide some details about your project.",
        fields: [
          {
            name: "quantityWindows",
            label: "Number of Windows (If applicable)",
            type: FormFieldType.Number,
            placeholder: "e.g., 5",
            validations: { min: 1 },
            conditionalDisplay: { fieldName: "productType", fieldValue: "windows" } // Show if windows or both selected in step 1
          },
          {
            name: "quantityDoors",
            label: "Number of Doors (If applicable)",
            type: FormFieldType.Number,
            placeholder: "e.g., 2",
            validations: { min: 1 },
            conditionalDisplay: { fieldName: "productType", fieldValue: "doors" } // Show if doors or both selected in step 1
          },
          {
            name: "projectTimeline",
            label: "Project Timeline",
            type: FormFieldType.Select,
            options: [
              {value: "asap", label: "As soon as possible"},
              {value: "1-3months", label: "1-3 Months"},
              {value: "3-6months", label: "3-6 Months"},
              {value: "flexible", label: "Flexible / Planning"},
            ],
            validations: { required: true },
          },
          {
            name: "additionalInfo",
            label: "Additional Information",
            type: FormFieldType.TextArea,
            placeholder: "Tell us more about your project, specific requirements, or any questions you have.",
            validations: { maxLength: 500 },
          }
        ]
      },
      {
        title: "Step 3: Your Contact Information",
        description: "How can we reach you with your quote?",
        fields: [
          { name: "fullName", label: "Full Name", type: FormFieldType.Text, validations: { required: true, minLength: 2 }, placeholder: "John Doe" },
          { name: "email", label: "Email Address", type: FormFieldType.Email, validations: { required: true }, placeholder: "you@example.com" },
          { name: "phone", label: "Phone Number", type: FormFieldType.Tel, validations: { required: true }, placeholder: "(555) 123-4567" },
          { name: "address", label: "Project Address (Optional)", type: FormFieldType.Address, placeholder: "123 Main St, Anytown, USA"},
          { name: "preferredContact", label: "Preferred Contact Method", type: FormFieldType.Radio, options: [{value: "email", label: "Email"}, {value: "phone", label: "Phone"}], defaultValue: "email" }
        ],
      },
    ],
  }
};
