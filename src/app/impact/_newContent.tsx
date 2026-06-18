          {/* Left — Outreach & Access (Lollipop) */}
          <div style={{ backgroundColor: "white", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(0,33,71,0.08)" }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-[3px] h-4 rounded-full" style={{ backgroundColor: "#185FA5" }} />
              <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", color: "#185FA5" }}>Outreach &amp; Access</p>
            </div>
            <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 14, marginLeft: 12 }}>Audience segments across the outreach portfolio</p>
            {(() => {
              const enrolled    = missionStudents.filter(s => s.status === "Active").length;
              const graduates   = missionStudents.filter(s => s.status === "Completed").length;
              const allSocial   = [
                ...masterclasses.map(m => m.bySocial),
                ...fieldVisits.map(v => v.bySocial),
                ...mentorshipPrograms.map(p => p.bySocial),
              ];
              const mcfScholars = allSocial.reduce((s, b) => s + b["MCF Scholars"], 0);
              const refugees    = allSocial.reduce((s, b) => s + b["Refugee-Displaced"], 0);
              const pwdCount    = allSocial.reduce((s, b) => s + b["PWD"], 0);
              const lolliData = [
                { name: "MCF Scholars",          value: mcfScholars },
                { name: "Youth with Disability", value: pwdCount    },
                { name: "Graduates",             value: graduates   },
                { name: "Refugees & Displaced",  value: refugees    },
                { name: "Currently Enrolled",    value: enrolled    },
              ].sort((a, b) => b.value - a.value);
              const maxVal = Math.max(...lolliData.map(d => d.value), 1);
              const BR = Bar as any;
              return (
                <ResponsiveContainer width="100%" height={238}>
                  <BarChart layout="vertical" data={lolliData} margin={{ top: 4, right: 52, bottom: 4, left: 4 }}>
                    <XAxis
                      type="number"
                      domain={[0, Math.ceil(maxVal * 1.18)]}
                      tick={{ fontSize: 9, fill: "#9CA3AF" }}
                      tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                      axisLine={false} tickLine={false}
                    />
                    <YAxis
                      type="category" dataKey="name"
                      tick={{ fontSize: 10, fill: "#374151" }}
                      width={136} axisLine={false} tickLine={false}
                    />
                    <Tooltip
                      cursor={false}
                      content={({ active, payload }: any) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div style={{ backgroundColor: "white", border: "1px solid rgba(0,33,71,0.1)", borderRadius: 6, padding: "8px 12px", fontSize: 11, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                            <p style={{ fontWeight: 700, color: "#185FA5", marginBottom: 2 }}>{d.name}</p>
                            <p style={{ color: "#042C53", fontWeight: 600 }}>{fmt(d.value)}</p>
                            <p style={{ color: "#9CA3AF", fontSize: 9, marginTop: 1 }}>{Math.round(d.value / maxVal * 100)}% of largest segment</p>
                          </div>
                        );
                      }}
                    />
                    <BR
                      dataKey="value"
                      shape={(props: any) => {
                        const { x, y, width, height: bh } = props;
                        if (!width || width <= 0) return <g />;
                        const cy = y + bh / 2;
                        const dotX = x + width;
                        const r = 5.5;
                        return (
                          <g>
                            <line x1={x + 2} y1={cy} x2={dotX - r} y2={cy} stroke="#185FA5" strokeWidth={1.5} />
                            <circle cx={dotX} cy={cy} r={r} fill="#185FA5" />
                            <text x={dotX + 9} y={cy + 1} textAnchor="start" fontSize={10} fontWeight={700} fill="#374151" dominantBaseline="middle">
                              {fmt(props.payload.value)}
                            </text>
                          </g>
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </div>
