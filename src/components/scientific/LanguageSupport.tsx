'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code2, Terminal, FileCode, Cpu, Database, BarChart3,
  Check, X, Play, Copy, Download, ChevronRight
} from 'lucide-react';

interface LanguageSupportProps {
  theme: string;
}

interface Language {
  id: string;
  name: string;
  icon: React.ReactNode;
  version: string;
  features: string[];
  extensions: string[];
  notebookSupport: boolean;
  debuggerSupport: boolean;
  sampleCode: string;
}

const languages: Language[] = [
  {
    id: 'python',
    name: 'Python',
    icon: <span className="text-xl">🐍</span>,
    version: '3.11+',
    features: ['NumPy', 'Pandas', 'SciPy', 'Matplotlib', 'Jupyter', 'Numba JIT'],
    extensions: ['.py', '.ipynb', '.pyx'],
    notebookSupport: true,
    debuggerSupport: true,
    sampleCode: `# Python: Statistical Analysis
import numpy as np
import pandas as pd
from scipy import stats

# Load NBA data
data = pd.read_csv('regular_season.csv')

# Calculate biotech analogies
fg_pct = data['FG_PCT'].mean()
transfection_efficiency = fg_pct * 100

print(f"Transfection Efficiency: {transfection_efficiency:.1f}%")

# Correlation analysis
corr = stats.pearsonr(data['AST'], data['PTS'])
print(f"Assist-Points Correlation: {corr[0]:.3f}")`
  },
  {
    id: 'r',
    name: 'R',
    icon: <span className="text-xl">📊</span>,
    version: '4.3+',
    features: ['tidyverse', 'ggplot2', 'dplyr', 'Bioconductor', 'Shiny'],
    extensions: ['.R', '.Rmd', '.Rnw'],
    notebookSupport: true,
    debuggerSupport: true,
    sampleCode: `# R: Biotech Translation Analysis
library(tidyverse)
library(ggplot2)

# Load NBA data
data <- read_csv("regular_season.csv")

# Calculate biotech metrics
biotech_metrics <- data %>%
  mutate(
    transfection_efficiency = FG_PCT * 100,
    specificity_ratio = FG3_PCT * 100,
    adverse_events = TOV / GP
  )

# Visualize
ggplot(biotech_metrics, aes(x = transfection_efficiency)) +
  geom_histogram(bins = 30, fill = "#22c55e") +
  labs(title = "Transfection Efficiency Distribution")`
  },
  {
    id: 'julia',
    name: 'Julia',
    icon: <span className="text-xl">🟣</span>,
    version: '1.9+',
    features: ['JuMP', 'Plots.jl', 'DataFrames.jl', 'Flux.jl', 'DifferentialEquations.jl'],
    extensions: ['.jl'],
    notebookSupport: true,
    debuggerSupport: true,
    sampleCode: `# Julia: High-Performance Analysis
using DataFrames, Statistics, Plots

# Load NBA data
data = DataFrame(CSV.File("regular_season.csv"))

# High-performance computation
function calculate_biotech_metrics(df)
  n = nrow(df)
  results = zeros(n, 3)
  
  Threads.@threads for i in 1:n
    results[i, 1] = df[i, :FG_PCT] * 100  # Transfection
    results[i, 2] = df[i, :FG3_PCT] * 100 # Specificity
    results[i, 3] = df[i, :TOV]           # Adverse events
  end
  
  return results
end

@time metrics = calculate_biotech_metrics(data)`
  },
  {
    id: 'cpp',
    name: 'C/C++',
    icon: <span className="text-xl">⚡</span>,
    version: 'C++20',
    features: ['Eigen', 'Armadillo', 'OpenMP', 'CUDA', 'MPI'],
    extensions: ['.cpp', '.cxx', '.cc', '.h', '.hpp'],
    notebookSupport: false,
    debuggerSupport: true,
    sampleCode: `// C++: High-Performance Computation
#include <Eigen/Dense>
#include <vector>
#include <omp.h>

using namespace Eigen;

struct BiotechMetrics {
    double transfection_efficiency;
    double specificity_ratio;
    double adverse_events;
};

std::vector<BiotechMetrics> calculate_metrics(
    const MatrixXd& fg_pct,
    const MatrixXd& fg3_pct,
    const VectorXd& turnovers
) {
    std::vector<BiotechMetrics> results(fg_pct.rows());
    
    #pragma omp parallel for
    for (int i = 0; i < fg_pct.rows(); ++i) {
        results[i].transfection_efficiency = fg_pct(i) * 100.0;
        results[i].specificity_ratio = fg3_pct(i) * 100.0;
        results[i].adverse_events = turnovers(i);
    }
    
    return results;
}`
  },
  {
    id: 'fortran',
    name: 'Fortran',
    icon: <span className="text-xl">🔢</span>,
    version: 'Fortran 2018',
    features: ['BLAS/LAPACK', 'OpenMP', 'Coarrays', 'MPI', 'HDF5'],
    extensions: ['.f90', '.f95', '.f03', '.f08'],
    notebookSupport: false,
    debuggerSupport: true,
    sampleCode: `! Fortran: Numerical Computation
program biotech_analysis
  use iso_fortran_env, only: real64
  implicit none
  
  real(real64), allocatable :: fg_pct(:), transfection(:)
  integer :: n, i
  
  ! Read data dimensions
  n = 24847  ! Total games
  allocate(fg_pct(n), transfection(n))
  
  ! Parallel computation
  !$omp parallel do
  do i = 1, n
    transfection(i) = fg_pct(i) * 100.0_real64
  end do
  !$omp end parallel do
  
  print *, "Transfection Efficiency Mean: ", sum(transfection) / n
  
  deallocate(fg_pct, transfection)
end program biotech_analysis`
  },
  {
    id: 'shell',
    name: 'Shell/Bash',
    icon: <span className="text-xl">🖥️</span>,
    version: 'Bash 5.x',
    features: ['Pipeline orchestration', 'Job scheduling', 'Data processing', 'Automation'],
    extensions: ['.sh', '.bash', '.zsh'],
    notebookSupport: false,
    debuggerSupport: false,
    sampleCode: `#!/bin/bash
# Shell: Data Pipeline

# Set paths
DATA_DIR="/data/nba"
OUTPUT_DIR="/results/biotech"

# Process each season
for season in {2010..2024}; do
  echo "Processing season: ${season}-${((season+1)%100)}"
  
  # Extract and transform
  awk -F',' 'NR>1 {
    fg_pct=$11
    trans_eff=fg_pct*100
    print $4","trans_eff
  }' "$DATA_DIR/season_${season}.csv" > "$OUTPUT_DIR/metrics_${season}.csv"
  
  # Run Python analysis
  python3 analyze.py "$OUTPUT_DIR/metrics_${season}.csv"
done

# Generate summary report
Rscript generate_report.R "$OUTPUT_DIR"`
  }
];

export default function LanguageSupport({ theme }: LanguageSupportProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedLanguage.sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex">
      {/* Language List */}
      <div className={`w-48 border-r ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
        <div className={`p-2 border-b ${theme === 'dark' ? 'border-[#30363d]' : 'border-gray-200'}`}>
          <h3 className="text-sm font-semibold">Languages</h3>
        </div>
        <ScrollArea className="h-[calc(100%-40px)]">
          <div className="p-1">
            {languages.map(lang => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                  selectedLanguage.id === lang.id
                    ? theme === 'dark' ? 'bg-[#21262d] text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'hover:bg-[#161b22] text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                {lang.icon}
                <span>{lang.name}</span>
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
      
      {/* Language Details */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedLanguage.icon}</div>
                <div>
                  <h2 className="text-xl font-bold">{selectedLanguage.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{selectedLanguage.version}</Badge>
                    {selectedLanguage.notebookSupport && (
                      <Badge className="bg-green-600 text-xs">Notebook</Badge>
                    )}
                    {selectedLanguage.debuggerSupport && (
                      <Badge className="bg-blue-600 text-xs">Debugger</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Install
              </Button>
            </div>
            
            {/* Features */}
            <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Key Libraries & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedLanguage.features.map(feature => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* File Extensions */}
            <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">File Extensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {selectedLanguage.extensions.map(ext => (
                    <code key={ext} className="px-2 py-1 bg-[#0d1117] rounded text-xs text-green-400">
                      {ext}
                    </code>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Sample Code */}
            <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Sample Code</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className={`p-3 rounded text-xs overflow-x-auto ${
                  theme === 'dark' ? 'bg-[#0d1117] text-gray-300' : 'bg-gray-50 text-gray-700'
                }`}>
                  <code>{selectedLanguage.sampleCode}</code>
                </pre>
              </CardContent>
            </Card>
            
            {/* Mix Language Support */}
            <Card className={`${theme === 'dark' ? 'bg-[#161b22] border-[#30363d]' : 'bg-white border-gray-200'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-500" />
                  Multi-Language Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-400">
                  {selectedLanguage.id === 'python' && (
                    <p>🐍 Python can call C/C++ via Cython, ctypes, or pybind11. Fortran via f2py. R via rpy2.</p>
                  )}
                  {selectedLanguage.id === 'cpp' && (
                    <p>⚡ C++ kernels callable from Python (pybind11), R (Rcpp), Julia (CxxWrap).</p>
                  )}
                  {selectedLanguage.id === 'julia' && (
                    <p>🟣 Julia can call Python (PyCall), R (RCall), C (ccall), and Fortran directly.</p>
                  )}
                  {selectedLanguage.id === 'r' && (
                    <p>📊 R integrates C/C++ via Rcpp, Fortran via .Fortran(), Python via reticulate.</p>
                  )}
                  {selectedLanguage.id === 'fortran' && (
                    <p>🔢 Fortran libraries callable from Python (f2py), Julia, and C/C++ directly.</p>
                  )}
                  {selectedLanguage.id === 'shell' && (
                    <p>🖥️ Shell orchestrates multi-language pipelines, connecting Python, R, Julia, and compiled code.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
