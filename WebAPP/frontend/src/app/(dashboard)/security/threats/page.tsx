'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSecurityStore } from '@/lib/stores/securityStore';
import { IOCType, IOCDetails } from '@/types/security';
import { Search, Shield, AlertTriangle, Globe, Hash, Mail, Link as LinkIcon, FileText, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

function ThreatIntelligencePageContent() {
  const { selectedIOC, iocsLoading, iocs, searchIOC, clearSelectedIOC } = useSecurityStore();
  const [searchType, setSearchType] = useState<IOCType>('ip');
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<IOCDetails[]>([]);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    const result = await searchIOC(searchType, searchValue.trim());
    
    if (result) {
      // Add to recent searches (keep last 5)
      setRecentSearches((prev) => {
        const filtered = prev.filter((ioc) => ioc.id !== result.id);
        return [result, ...filtered].slice(0, 5);
      });
    }
  };

  const handleQuickSearch = (ioc: IOCDetails) => {
    setSearchType(ioc.type);
    setSearchValue(ioc.value);
    searchIOC(ioc.type, ioc.value);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getReputationColor = (reputation: string) => {
    switch (reputation) {
      case 'malicious':
        return 'bg-red-500 text-white';
      case 'suspicious':
        return 'bg-orange-500 text-white';
      case 'unknown':
        return 'bg-gray-500 text-white';
      case 'clean':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: IOCType) => {
    switch (type) {
      case 'ip':
        return <Globe className="h-4 w-4" />;
      case 'domain':
        return <Globe className="h-4 w-4" />;
      case 'url':
        return <LinkIcon className="h-4 w-4" />;
      case 'fileSha256':
      case 'fileSha1':
        return <Hash className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              Threat Intelligence
            </h1>
            <p className="text-gray-600 mt-1">
              IOC analysis and threat intelligence lookup
            </p>
          </div>
        </div>

        {/* IOC Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              IOC Lookup
            </CardTitle>
            <CardDescription>
              Search for indicators of compromise in the Trend Vision One threat intelligence database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="w-48">
                <Select value={searchType} onValueChange={(value) => setSearchType(value as IOCType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ip">IP Address</SelectItem>
                    <SelectItem value="domain">Domain</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="fileSha256">File SHA256</SelectItem>
                    <SelectItem value="fileSha1">File SHA1</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input
                  placeholder={`Enter ${searchType} to search...`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={iocsLoading || !searchValue.trim()}>
                {iocsLoading ? 'Searching...' : 'Search'}
              </Button>
              {selectedIOC && (
                <Button variant="outline" onClick={() => {
                  clearSelectedIOC();
                  setSearchValue('');
                }}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search Result */}
        {selectedIOC && (
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(selectedIOC.type)}
                    <CardTitle className="text-xl">IOC Details</CardTitle>
                    <Badge className={getReputationColor(selectedIOC.reputation)}>
                      {selectedIOC.reputation.toUpperCase()}
                    </Badge>
                    <Badge variant={getSeverityColor(selectedIOC.severity)}>
                      {selectedIOC.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                    {selectedIOC.value}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getRiskScoreColor(selectedIOC.riskScore)}`}>
                    {selectedIOC.riskScore}
                  </div>
                  <div className="text-sm text-gray-600">Risk Score</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Threat Type */}
              {selectedIOC.threatType && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Threat Type</h3>
                  <Badge variant="outline" className="capitalize">
                    {selectedIOC.threatType}
                  </Badge>
                </div>
              )}

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">First Seen</h3>
                  <p className="text-sm text-gray-900">
                    {formatDistanceToNow(new Date(selectedIOC.firstSeen), { addSuffix: true })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedIOC.firstSeen).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Last Seen</h3>
                  <p className="text-sm text-gray-900">
                    {formatDistanceToNow(new Date(selectedIOC.lastSeen), { addSuffix: true })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(selectedIOC.lastSeen).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Occurrences</h3>
                <p className="text-2xl font-bold text-gray-900">{selectedIOC.occurrences}</p>
                  <p className="text-xs text-gray-500">Detection count across all sources</p>
              </div>

              {/* Sources */}
              {selectedIOC.sources && selectedIOC.sources.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Intelligence Sources</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIOC.sources.map((source, idx) => (
                      <Badge key={idx} variant="outline">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedIOC.tags && selectedIOC.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIOC.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Geo Location */}
              {selectedIOC.geoLocation && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Geo Location</h3>
                  <p className="text-sm text-gray-900">
                    {selectedIOC.geoLocation.city ? `${selectedIOC.geoLocation.city}, ` : ''}
                    {selectedIOC.geoLocation.country}
                  </p>
                </div>
              )}

              {/* WHOIS */}
              {selectedIOC.whois && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">WHOIS Information</h3>
                  <div className="bg-gray-50 p-3 rounded space-y-1">
                    {selectedIOC.whois.registrar && (
                      <p className="text-sm">
                        <span className="font-medium">Registrar:</span> {selectedIOC.whois.registrar}
                      </p>
                    )}
                    {selectedIOC.whois.registrationDate && (
                      <p className="text-sm">
                        <span className="font-medium">Registered:</span>{' '}
                        {new Date(selectedIOC.whois.registrationDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Related Alerts */}
              {selectedIOC.relatedAlerts && selectedIOC.relatedAlerts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Related Alerts ({selectedIOC.relatedAlerts.length})
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 rounded p-3">
                    <p className="text-sm text-gray-700">
                      This IOC is associated with {selectedIOC.relatedAlerts.length} security alert(s).
                    </p>
                    <Button variant="link" className="p-0 h-auto text-blue-600" asChild>
                      <Link href="/security/alerts">View Related Alerts →</Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Related Endpoints */}
              {selectedIOC.relatedEndpoints && selectedIOC.relatedEndpoints.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Affected Endpoints ({selectedIOC.relatedEndpoints.length})
                  </h3>
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-gray-700">
                      {selectedIOC.relatedEndpoints.length} endpoint(s) have been affected by this IOC.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-blue-600" asChild>
                      <Link href="/security/endpoints">View Endpoints →</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {selectedIOC === null && searchValue && !iocsLoading && (
          <Card className="border-2 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center text-gray-700">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">No Threat Found</h3>
                <p className="text-sm text-gray-600">
                  The searched IOC was not found in the threat intelligence database.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !selectedIOC && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
              <CardDescription>Your recent IOC lookups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentSearches.map((ioc) => (
                  <div
                    key={ioc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleQuickSearch(ioc)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {getTypeIcon(ioc.type)}
                      <div className="flex-1">
                        <div className="font-mono text-sm truncate">{ioc.value}</div>
                        <div className="text-xs text-gray-500 capitalize">{ioc.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getReputationColor(ioc.reputation)}>
                        {ioc.reputation}
                      </Badge>
                      <Badge variant={getSeverityColor(ioc.severity)}>
                        {ioc.severity}
                      </Badge>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Known IOCs Database */}
        <Card>
          <CardHeader>
            <CardTitle>Known IOCs Database</CardTitle>
            <CardDescription>
              Sample of indicators tracked in threat intelligence ({iocs.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {iocs.slice(0, 10).map((ioc) => (
                <div
                  key={ioc.id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleQuickSearch(ioc)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getTypeIcon(ioc.type)}
                    <div className="flex-1">
                      <div className="font-mono text-sm truncate max-w-md">{ioc.value}</div>
                      <div className="text-xs text-gray-500">
                        {ioc.occurrences} occurrences • {formatDistanceToNow(new Date(ioc.lastSeen), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`text-2xl font-bold ${getRiskScoreColor(ioc.riskScore)}`}>
                      {ioc.riskScore}
                    </div>
                    <Badge variant={getSeverityColor(ioc.severity)} className="ml-2">
                      {ioc.severity}
                    </Badge>
                    <ExternalLink className="h-4 w-4 text-gray-400 ml-2" />
                  </div>
                </div>
              ))}
            </div>
            {iocs.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Showing 10 of {iocs.length} IOCs
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

export default ThreatIntelligencePageContent;
