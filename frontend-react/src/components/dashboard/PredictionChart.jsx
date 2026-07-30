import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const PredictionChart = ({ result }) => {
    return (
        <div className="bg-light-dark p-4 rounded h-100 shadow-sm d-flex flex-column justify-content-center align-items-center">
            {result ? (
                <div className="w-100 text-start animate-fade">
                    <h4 className="text-info mb-3 text-center">
                        <FontAwesomeIcon icon={faChartLine} className="me-2" />
                        Prediction Model Matrix
                    </h4>
                    <hr className="border-secondary" />
                    
                    {/* AreaChart Graph Component */}
                    <div className="my-4" style={{ width: '100%', height: 220 }}>
                        <ResponsiveContainer>
                            <AreaChart data={result.chart_points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#17a2b8" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#17a2b8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                                <XAxis dataKey="day" stroke="#a0aec0" fontSize={11} tickLine={false} />
                                <YAxis stroke="#a0aec0" fontSize={11} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                                <Tooltip contentStyle={{ backgroundColor: '#1a202c', borderColor: '#2d3748', color: '#fff' }} />
                                <Area type="monotone" dataKey="price" stroke="#17a2b8" strokeWidth={3} fillOpacity={1} fill="url(#chartColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="row text-center mb-3">
                        <div className="col-6 border-end border-secondary">
                            <div className="text-secondary small uppercase tracking-wider">Projected Value</div>
                            <h2 className="text-success mt-1 fw-bold">${result.estimated_price}</h2>
                        </div>
                        <div className="col-6">
                            <div className="text-secondary small uppercase tracking-wider">Confidence Rating</div>
                            <h2 className="text-warning mt-1 fw-bold">{result.confidence_score}%</h2>
                        </div>
                    </div>
                    
                    <div className="p-3 bg-dark rounded border border-secondary text-start mt-2">
                        <span className="badge bg-secondary mb-2">Model Signal Summary</span>
                        <p className="small mb-0" style={{ color: '#cbd5e0' }}>{result.analysis_summary}</p>
                    </div>
                </div>
            ) : (
                <div className="text-muted p-5 text-center">
                    <FontAwesomeIcon icon={faChartLine} size="4x" className="mb-3 opacity-25" />
                    <h5>No Forecast Compiled</h5>
                    <p className="small mb-0">Select core settings on the config panel to execute your linear regression files.</p>
                </div>
            )}
        </div>
    );
};

export default PredictionChart;
