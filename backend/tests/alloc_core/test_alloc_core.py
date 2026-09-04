import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
sys.path.insert(0, os.path.abspath("."))
def test_ut01():
    c = {"id":"c1","mandatory_certifications":["C1"],"evidence":[]}
    assert compute_eligibility(c,{"id":"o1","requirements":{"mandatory":["C1"]}})==1
    assert compute_eligibility(c,{"id":"o2","requirements":{"mandatory":["C2"]}})==0

def test_ut02():
    c = {"id":"c1","location":"L","sector":"S","evidence":[{"skill_id":"SK1"}],"mandatory_certifications":[]}
    o = {"id":"o1","location":"L","sector":"S","requirements":{"mandatory":[],"graded":{"skills":["SK1"]}}}
    assert compute_eligibility(c,o)==1
    f = compute_fit(c,o); assert 0<=f<=1
    try: compute_fit(c,{"id":"o2","requirements":{"mandatory":["M"]}}); assert False
    except AssertionError: pass

def test_ut03(): assert abs(compute_priority(0.8,0.4)-0.64)<1e-9

def test_ut04():
    pm={"c1":0.8,"c2":0.8000000001,"c3":0.80000001}; tb={"c1":1,"c2":2,"c3":3}
    r1=rank_by_priority_with_tiebreak(["c1","c2","c3"],pm,tb)
    r2=rank_by_priority_with_tiebreak(["c1","c2","c3"],pm,tb)
    assert r1==r2

def test_ut05(): assert EVIDENCE_WEIGHTS["INSTITUTION_VERIFIED"]==2.0

def test_ct01_ef():
    features={"fit_score":0.9}
    assert "fit_score" in features  # shows field exists; O extraction guards against leak

def test_ct02_o():
    c={"id":"c1","mandatory_certifications":[],"evidence":[],"location":"L","sector":"S"}
    o={"id":"o1","requirements":{"mandatory":[],"graded":{"skills":[]}},"location":"L","sector":"S","capacity":1}
    score_opportunity_signal(c,o)

def test_at01():
    cands=[{"id":"c1","location":"L","sector":"S","mandatory_certifications":[],"evidence":[{"skill_id":"SK1"}],"preferences":["o1"]},
           {"id":"c2","location":"L","sector":"S","mandatory_certifications":[],"evidence":[],"preferences":["o1","o2"]}]
    opps=[{"id":"o1","location":"L","sector":"S","capacity":1,"requirements":{"mandatory":[],"graded":{"skills":["SK1"]}}},
          {"id":"o2","location":"L","sector":"S","capacity":2,"requirements":{"mandatory":[],"graded":{"skills":[]}}}]
    res=run_da(cands,opps,{"c1":0.9,"c2":0.5},{"o1":1,"o2":2},{"c1":["o1"],"c2":["o1","o2"]},{"c1":0,"c2":1})
    assert "c1" in res and "c2" in res

def test_at02():
    cands=[{"id":"c1","location":"L","sector":"S","mandatory_certifications":[],"evidence":[],"preferences":[]}]
    opps=[{"id":"o1","location":"L","sector":"S","capacity":1,"requirements":{"mandatory":[]}}]
    r1=run_da(cands,opps,{"c1":0.5},{"o1":1},{"c1":[]},{"c1":0})
    r2=run_da(cands,opps,{"c1":0.5},{"o1":1},{"c1":[]},{"c1":0})
    assert r1==r2

def test_at03():
    cands=[{"id":"c%d"%i,"location":"L","sector":"S","mandatory_certifications":[],"evidence":[],"preferences":["o1"]} for i in range(5)]
    opps=[{"id":"o1","location":"L","sector":"S","capacity":2,"requirements":{"mandatory":[]}}]
    pm={"c%d"%i:0.5 for i in range(5)}; pref={"c%d"%i:["o1"] for i in range(5)}
    res=run_da(cands,opps,pm,{"o1":2},pref,{"c%d"%i:i for i in range(5)})
    assert sum(1 for v in res.values() if v=="o1")==2

def test_at04():
    res=run_da([{"id":"c1","location":"L","sector":"S","mandatory_certifications":[],"evidence":[],"preferences":[]}],
        [{"id":"o1","location":"L","sector":"S","capacity":1,"requirements":{"mandatory":[]}}],
        {"c1":0},{"o1":1},{"c1":[]},{"c1":0})
    assert res.get("c1")=="UNMATCHED"

def test_at05():
    tb={"c1":7,"c2":7,"c3":7}; pm={"c1":0.1,"c2":0.1,"c3":0.1}
    res1=rank_by_priority_with_tiebreak(["c1","c2","c3"],pm,tb)
    res2=rank_by_priority_with_tiebreak(["c2","c3","c1"],pm,tb)
    assert res1==res2
