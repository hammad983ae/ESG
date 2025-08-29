import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { ESGScores } from "@/utils/esgCalculations";
import { PropertyData } from "./PropertyAssessmentForm";
import { exportToExcelFormulas } from "@/utils/esgCalculations";

interface ExportToolsProps {
  scores: ESGScores;
  propertyData: PropertyData;
}

export function ExportTools({ scores, propertyData }: ExportToolsProps) {
  const exportToCSV = () => {
    const csvData = [
      ['ESG Assessment Report'],
      ['Property Name', propertyData.propertyName],
      ['Location', propertyData.location],
      ['Assessment Date', new Date().toLocaleDateString()],
      [''],
      ['Overall Scores'],
      ['Overall ESG Score', scores.overallESGScore.toFixed(2)],
      ['Risk Rating', scores.riskRating.toString()],
      ['Risk Level', scores.riskLevel],
      [''],
      ['Environmental Scores'],
      ['Energy Efficiency', scores.environmental.energyEfficiency.toFixed(2)],
      ['Water Conservation', scores.environmental.waterConservation.toFixed(2)],
      ['Waste Management', scores.environmental.wasteManagement.toFixed(2)],
      ['Material Sustainability', scores.environmental.materialSustainability.toFixed(2)],
      ['Environmental Overall', scores.environmental.overall.toFixed(2)],
      [''],
      ['Social Scores'],
      ['Accessibility', scores.social.accessibility.toFixed(2)],
      ['Health & Wellbeing', scores.social.healthWellbeing.toFixed(2)],
      ['Community Engagement', scores.social.communityEngagement.toFixed(2)],
      ['Social Overall', scores.social.overall.toFixed(2)],
      [''],
      ['Governance Scores'],
      ['Certifications', scores.governance.certifications.toFixed(2)],
      ['Transparency', scores.governance.transparency.toFixed(2)],
      ['Risk Management', scores.governance.riskManagement.toFixed(2)],
      ['Governance Overall', scores.governance.overall.toFixed(2)],
      [''],
      ['Property Details'],
      ['Property Type', propertyData.propertyType],
      ['Year Built', propertyData.yearBuilt.toString()],
      ['Square Footage', propertyData.squareFootage.toString()],
      ['Actual Energy Use', propertyData.actualEnergyUse.toString()],
      ['Benchmark Energy Use', propertyData.benchmarkEnergyUse.toString()],
      ['Water Efficient Fixtures', propertyData.waterEfficientFixtures.toString()],
      ['Total Fixtures', propertyData.totalFixtures.toString()],
      ['Sustainable Materials %', propertyData.sustainableMaterialsPercentage.toString()],
      ['Certifications', propertyData.certifications.join('; ')],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ESG_Assessment_${propertyData.propertyName.replace(/[^a-z0-9]/gi, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportToJSON = () => {
    const jsonData = {
      assessmentDate: new Date().toISOString(),
      propertyData,
      scores,
      formulas: exportToExcelFormulas()
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ESG_Assessment_${propertyData.propertyName.replace(/[^a-z0-9]/gi, '_')}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const printReport = () => {
    window.print();
  };

  const generateExcelTemplate = () => {
    const excelData = [
      ['ESG Property Assessment Template'],
      [''],
      ['Property Information'],
      ['Property Name', propertyData.propertyName],
      ['Location', propertyData.location],
      ['Property Type', propertyData.propertyType],
      ['Year Built', propertyData.yearBuilt],
      ['Square Footage', propertyData.squareFootage],
      [''],
      ['Energy Data'],
      ['Actual Energy Use (kWh/sq ft/year)', propertyData.actualEnergyUse],
      ['Benchmark Energy Use (kWh/sq ft/year)', propertyData.benchmarkEnergyUse],
      ['Energy Efficiency Score Formula', 'MAX(1, MIN(5, (1 - (B11 / B12)) * 5))'],
      [''],
      ['Water Conservation'],
      ['Water Efficient Fixtures', propertyData.waterEfficientFixtures],
      ['Total Fixtures', propertyData.totalFixtures],
      ['Water Conservation Score Formula', 'MIN(5, (B16 / B17) * 5)'],
      [''],
      ['Waste Management'],
      ['Has Recycling Program', propertyData.hasRecyclingProgram ? 'TRUE' : 'FALSE'],
      ['Has Composting', propertyData.hasComposting ? 'TRUE' : 'FALSE'],
      ['Waste Management Score Formula', 'MIN(5, IF(B21, 3, 1) + IF(B22, 2, 0))'],
      [''],
      ['Materials'],
      ['Sustainable Materials Percentage', propertyData.sustainableMaterialsPercentage],
      ['Material Sustainability Score Formula', 'MIN(5, (B25 / 100) * 5)'],
      [''],
      ['Social Factors'],
      ['ADA Standards Compliance', propertyData.meetsADAStandards],
      ['Good Air Quality', propertyData.hasGoodAirQuality ? 'TRUE' : 'FALSE'],
      ['Natural Light', propertyData.hasNaturalLight ? 'TRUE' : 'FALSE'],
      ['Ergonomic Design', propertyData.hasErgonomicDesign ? 'TRUE' : 'FALSE'],
      ['Community Space', propertyData.hasCommunitySpace ? 'TRUE' : 'FALSE'],
      ['Local Sourcing', propertyData.hasLocalSourcing ? 'TRUE' : 'FALSE'],
      [''],
      ['Certifications'],
      ['LEED', propertyData.certifications.includes('LEED') ? 'TRUE' : 'FALSE'],
      ['ENERGY STAR', propertyData.certifications.includes('ENERGY STAR') ? 'TRUE' : 'FALSE'],
      ['Green Star', propertyData.certifications.includes('Green Star') ? 'TRUE' : 'FALSE'],
      ['NABERS', propertyData.certifications.includes('NABERS') ? 'TRUE' : 'FALSE'],
      [''],
      ['Governance'],
      ['ESG Data Public', propertyData.esgDataPublic ? 'TRUE' : 'FALSE'],
      ['ESG Report Available', propertyData.esgReportAvailable ? 'TRUE' : 'FALSE'],
      ['Risk Management Practices', propertyData.riskManagementPractices],
      ['Total Potential Practices', propertyData.totalPotentialPractices],
      [''],
      ['Calculated Scores'],
      ['Overall ESG Score', scores.overallESGScore.toFixed(2)],
      ['Risk Rating', scores.riskRating.toString()],
      ['Risk Level', scores.riskLevel],
      [''],
      ['Excel Formulas for Reference'],
      ['Energy Efficiency', 'MAX(1, MIN(5, (1 - (Actual_Energy_Use / Benchmark_Energy_Use)) * 5))'],
      ['Water Conservation', 'MIN(5, (Water_Efficient_Fixtures / Total_Fixtures) * 5)'],
      ['Waste Management', 'MIN(5, IF(Has_Recycling, 3, 1) + IF(Has_Composting, 2, 0))'],
      ['Material Sustainability', 'MIN(5, (Sustainable_Materials_Percentage / 100) * 5)'],
      ['Overall ESG Score', '(Environmental_Weight * Environmental_Score + Social_Weight * Social_Score + Governance_Weight * Governance_Score)'],
      ['Risk Rating', 'MIN(5, MAX(1, ROUND((1 - (Overall_ESG_Score / 5) + Additional_Risk_Factors) * 4 + 1, 0)))']
    ];

    const csvContent = excelData.map(row => row.join('\\t')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ESG_Excel_Template_${propertyData.propertyName.replace(/[^a-z0-9]/gi, '_')}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export & Print Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export CSV
          </Button>
          
          <Button onClick={generateExcelTemplate} variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Excel Template
          </Button>
          
          <Button onClick={exportToJSON} variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export JSON
          </Button>
          
          <Button onClick={printReport} variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
        </div>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Excel Integration Guide:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• CSV exports can be opened directly in Excel</li>
            <li>• Excel Template includes all formulas for automatic calculations</li>
            <li>• JSON export contains raw data and formula references</li>
            <li>• Use Print option for physical reports</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}