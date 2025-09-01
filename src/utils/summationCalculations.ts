export interface SummationComponent {
  name: string;
  area: number;
  rate: number;
  added_value?: number;
}

export interface SummationInputs {
  components: SummationComponent[];
  esg_factor: number;
}

export interface SummationResults {
  components: SummationComponent[];
  total_value: number;
  adjusted_value_with_esg: number;
  esg_factor: number;
}

export function calculateSummationValue(
  components: SummationComponent[], 
  esg_factor: number = 1.0
): SummationResults {
  let total_value = 0;
  
  // Calculate added value for each component
  const updatedComponents = components.map(component => {
    const added_value = component.area * component.rate;
    total_value += added_value;
    
    return {
      ...component,
      added_value
    };
  });
  
  const adjusted_value_with_esg = total_value * esg_factor;
  
  return {
    components: updatedComponents,
    total_value,
    adjusted_value_with_esg,
    esg_factor
  };
}

export const defaultSummationComponents: SummationComponent[] = [
  { name: "Land Value", area: 4204, rate: 0 },
  { name: "Dwelling Value", area: 336, rate: 0 },
  { name: "Car Accommodation", area: 72, rate: 0 },
  { name: "Outdoor Areas", area: 44, rate: 0 },
  { name: "Shedding/Bungalow", area: 1, rate: 0 },
  { name: "Pool", area: 0, rate: 0 },
  { name: "FPG", area: 1, rate: 0 }
];