# Basketball-to-Biotech Scientific IDE

A comprehensive scientific computing IDE that enables biotech research through a translation layer of basketball statistics, with multi-language support and enterprise-grade tooling.

## 🚀 Two IDE Experiences

### 1. Basketball IDE (`/basketball-ide`)
- NBA statistics data grid (2010-2024)
- Biotech translation layer with 12 analogies
- LLM-powered analysis assistant
- Code editor with sample scripts
- Settings and extensions panel

### 2. Scientific IDE (`/scientific-ide`)
- Full multi-language support
- Interactive notebooks
- Integrated debugging
- HPC/remote computing

## ✨ Features

### 1. Multi-Language Support
- **Python 3.11+** - NumPy, Pandas, SciPy, Matplotlib, Jupyter
- **R 4.3+** - tidyverse, ggplot2, Bioconductor
- **Julia 1.9+** - JuMP, Plots.jl, Flux.jl
- **C/C++** - Eigen, Armadillo, OpenMP, CUDA
- **Fortran 2018** - BLAS/LAPACK, Coarrays
- **Shell/Bash** - Pipeline orchestration

### 2. Non-intrusive Build Integration
- Make, CMake, Snakemake, Nextflow support
- Dependency graph visualization
- Target-based build system

### 3. Interactive Notebook Workflow
- Jupyter-style cell interface
- Code, Markdown, Raw cells
- Kernel status management
- Export to .ipynb

### 4. Integrated Visualization
- Matplotlib, Plotly, ggplot2 support
- Plot gallery and comparison view
- Export to PNG, SVG, PDF, HTML

### 5. Variable Inspector
- Rich data exploration (NumPy, pandas, xarray)
- Shape/dimension display
- Quick stats preview
- Memory usage monitoring

### 6. Scientific Debugger
- Breakpoint management
- Call stack view
- Variable watches
- Step controls

### 7. Testing & Quality
- Test discovery and execution
- Coverage reporting
- Benchmark results

### 8. Remote/HPC Support
- Slurm, PBS, cloud integration
- Job queue management
- Resource monitoring (CPU, GPU, Memory)

### 9. Project Management
- Environment management (conda, venv)
- Dependency tracking
- Reproducibility checklist

## 🧬 Basketball-to-Biotech Translation

| Basketball Stat | Biotech Equivalent | Description |
|----------------|-------------------|-------------|
| FG% | Transfection Efficiency | Successful deliveries / Total attempts |
| 3P% | Specificity Ratio | Target hits / Off-target hits |
| Assists | Synergy Index | Enhanced outcomes from combinations |
| Rebounds | Recapture Rate | Molecules recovered |
| Turnovers | Adverse Events | Unintended negative outcomes |
| Plus/Minus | Therapeutic Index | Toxic dose / Effective dose |
| PPG | Bioavailability | Drug reaching circulation |
| Blocks | Inhibition Constant (Ki) | Target blocking efficiency |

## 📊 Data Files

- `regular_season_totals_2010_2024.csv` - 24,847 NBA games
- `play_off_totals_2010_2024.csv` - Playoff statistics

## 🛠️ Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/nba/teams` | Aggregated team statistics |
| `/api/nba/trends` | League-wide trends |
| `/api/nba/regular-season` | Regular season game data |
| `/api/nba/playoffs` | Playoff game data |
| `/api/llm/chat` | LLM chat completions |

## 📦 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **AI**: z-ai-web-dev-sdk

## 📝 License

MIT
