'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, Award, CheckCircle2, AlertTriangle, Info, BookOpen,
  ExternalLink, Scale, Target, TrendingUp, Lock
} from 'lucide-react';

interface TrustIndicatorsProps {
  confidence: {
    overall: number;
    dataQuality: number;
    methodology: number;
    reproducibility: number;
    statistical: number;
  };
  calibration: {
    benchmarked: boolean;
    benchmarkSource: string;
    accuracyScore: number;
    certifications: string[];
  };
  showDetails?: boolean;
}

export default function TrustIndicators({ confidence, calibration, showDetails = true }: TrustIndicatorsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-4">
      {/* Overall Trust Score */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Trust Score
            </CardTitle>
            <Badge className={`${getScoreColor(confidence.overall)} bg-transparent border`}>
              {getScoreLabel(confidence.overall)}
            </Badge>
          </div>
          <CardDescription>
            How much can you trust these results?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className={`text-4xl font-bold ${getScoreColor(confidence.overall)}`}>
              {Math.round(confidence.overall)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Overall Confidence</p>
          </div>
          
          {/* Individual Scores */}
          <div className="space-y-3">
            <ScoreBar label="Data Quality" score={confidence.dataQuality} description="How complete and accurate is your data?" />
            <ScoreBar label="Methodology" score={confidence.methodology} description="Are the analysis methods appropriate?" />
            <ScoreBar label="Reproducibility" score={confidence.reproducibility} description="Could someone else get the same results?" />
            <ScoreBar label="Statistical Rigor" score={confidence.statistical} description="Are the statistical methods sound?" />
          </div>
        </CardContent>
      </Card>

      {/* Calibration Information */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-400" />
            Calibration & Validation
          </CardTitle>
          <CardDescription>
            How do we know this system works correctly?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {calibration.benchmarked ? (
            <>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-sm">Benchmarked against: {calibration.benchmarkSource}</span>
              </div>
              
              <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Validation Accuracy</span>
                  <span className="text-sm font-medium text-emerald-400">{calibration.accuracyScore}%</span>
                </div>
                <Progress value={calibration.accuracyScore} className="h-2" />
              </div>
              
              {calibration.certifications.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Certifications & Standards:</p>
                  <div className="flex flex-wrap gap-1">
                    {calibration.certifications.map((cert, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">Not yet calibrated - results should be validated independently</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* What This Means */}
      {showDetails && (
        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              What Do These Scores Mean?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong className="text-emerald-400">90%+ Excellent:</strong> Results are highly reliable and suitable for publication or decision-making.
            </p>
            <p>
              <strong className="text-blue-400">80-89% Very Good:</strong> Results are reliable with minor limitations that should be noted.
            </p>
            <p>
              <strong className="text-yellow-400">70-79% Good:</strong> Results are usable but should be validated with additional data.
            </p>
            <p>
              <strong className="text-orange-400">60-69% Fair:</strong> Results are preliminary and need more investigation.
            </p>
            <p>
              <strong className="text-red-400">Below 60%:</strong> Results need significant additional work before drawing conclusions.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Scientific Review Status */}
      <Card className="bg-[#161b22] border-[#30363d]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            Peer Review Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <CheckItem label="Methodology documented" checked={confidence.methodology > 80} />
            <CheckItem label="Data sources cited" checked={confidence.dataQuality > 75} />
            <CheckItem label="Reproducible workflow" checked={confidence.reproducibility > 80} />
            <CheckItem label="Statistical methods valid" checked={confidence.statistical > 75} />
          </div>
          
          <div className="mt-4 p-2 bg-[#0d1117] rounded text-xs text-gray-400">
            💡 <strong>Tip:</strong> For peer-reviewed publication, aim for all scores above 80%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ScoreBar({ label, score, description }: { label: string; score: number; description: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className={score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}>
          {Math.round(score)}%
        </span>
      </div>
      <Progress 
        value={score} 
        className={`h-1.5 ${
          score >= 80 ? 'bg-green-500/20' : 
          score >= 60 ? 'bg-yellow-500/20' : 
          'bg-red-500/20'
        }`}
      />
      <p className="text-[10px] text-gray-500 mt-1">{description}</p>
    </div>
  );
}

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {checked ? (
        <CheckCircle2 className="w-3 h-3 text-green-400" />
      ) : (
        <div className="w-3 h-3 rounded-full border border-gray-500" />
      )}
      <span className={checked ? 'text-gray-300' : 'text-gray-500'}>{label}</span>
    </div>
  );
}
