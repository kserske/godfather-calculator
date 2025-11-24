import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, Info, Package, Coins } from 'lucide-react';
import './Calculator.css';

const GodfatherCalculator = () => {
  const [equipmentType, setEquipmentType] = useState('tops');
  const [currentLevel, setCurrentLevel] = useState('creation');
  const [targetLevel, setTargetLevel] = useState('legacy');
  
  const [ownedPlain, setOwnedPlain] = useState(0);
  const [ownedSimple, setOwnedSimple] = useState(0);
  const [ownedRare, setOwnedRare] = useState(0);
  const [ownedElite, setOwnedElite] = useState(0);
  const [ownedGrand, setOwnedGrand] = useState(0);
  
  // Elite equipment counts
  const [eliteEquipTops, setEliteEquipTops] = useState(0);
  const [eliteEquipRange, setEliteEquipRange] = useState(0);
  const [eliteEquipMelee, setEliteEquipMelee] = useState(0);
  const [eliteEquipPants, setEliteEquipPants] = useState(0);
  const [eliteEquipShoes, setEliteEquipShoes] = useState(0);
  const [eliteEquipAccessory, setEliteEquipAccessory] = useState(0);
  
  const [ownedLegacyPlain, setOwnedLegacyPlain] = useState(0);
  const [ownedLegacySimple, setOwnedLegacySimple] = useState(0);
  const [ownedLegacyRare, setOwnedLegacyRare] = useState(0);
  const [ownedLegacyElite, setOwnedLegacyElite] = useState(0);
  const [ownedLegacyGrand, setOwnedLegacyGrand] = useState(0);

  const equipmentCosts = {
    tops: { contracts: 10, legacyCoins: 30 },
    range: { contracts: 8, legacyCoins: 24 },
    melee: { contracts: 6, legacyCoins: 18 },
    pants: { contracts: 5, legacyCoins: 15 },
    shoes: { contracts: 7, legacyCoins: 21 },
    accessory: { contracts: 14, legacyCoins: 42 }
  };

  const dismantleValues = {
    tops: 680,
    range: 544,
    melee: 408,
    pants: 340,
    shoes: 476,
    accessory: 952
  };

  const levels = [
    'creation', 'plain', 'simple', 'simple+1', 'simple+2', 'simple+3',
    'rare', 'rare+1', 'rare+2', 'rare+3',
    'elite', 'elite+1', 'elite+2', 'elite+3',
    'grand', 'grand+1', 'grand+2', 'grand+3', 'legacy'
  ];

  const levelNames = {
    'creation': 'None', 'plain': 'Plain', 'simple': 'Simple',
    'simple+1': 'Simple +1', 'simple+2': 'Simple +2', 'simple+3': 'Simple +3',
    'rare': 'Rare', 'rare+1': 'Rare +1', 'rare+2': 'Rare +2', 'rare+3': 'Rare +3',
    'elite': 'Elite', 'elite+1': 'Elite +1', 'elite+2': 'Elite +2', 'elite+3': 'Elite +3',
    'grand': 'Grand', 'grand+1': 'Grand +1', 'grand+2': 'Grand +2', 'grand+3': 'Grand +3',
    'legacy': 'Legacy'
  };

  const targetLevels = levels.filter(level => level !== 'creation');

  const requiresLegacyCoins = useMemo(() => {
    const targetIdx = levels.indexOf(targetLevel);
    const grandPlusOneIdx = levels.indexOf('grand+1');
    return targetIdx >= grandPlusOneIdx;
  }, [targetLevel]);

  // Calculate elite equipment plain contract value
  const eliteEquipmentPlainContracts = 
    (eliteEquipTops * dismantleValues.tops) +
    (eliteEquipRange * dismantleValues.range) +
    (eliteEquipMelee * dismantleValues.melee) +
    (eliteEquipPants * dismantleValues.pants) +
    (eliteEquipShoes * dismantleValues.shoes) +
    (eliteEquipAccessory * dismantleValues.accessory);

  const calculations = useMemo(() => {
    const startIdx = levels.indexOf(currentLevel);
    const endIdx = levels.indexOf(targetLevel);
    
    if (startIdx >= endIdx) {
      return { 
        needed: { plain: 0, simple: 0, rare: 0, elite: 0, legacyCoins: 0, totalPlainEquiv: 0, totalLegacyPlainEquiv: 0 },
        consolidated: { grand: 0, elite: 0, rare: 0, simple: 0, plain: 0, legacyGrand: 0, legacyElite: 0, legacyRare: 0, legacySimple: 0, legacyPlain: 0, totalPlainEquiv: 0, totalLegacyPlainEquiv: 0 },
        remaining: { grand: 0, elite: 0, rare: 0, simple: 0, plain: 0, legacyGrand: 0, legacyElite: 0, legacyRare: 0, legacySimple: 0, legacyPlain: 0, totalPlainEquiv: 0, totalLegacyPlainEquiv: 0 }
      };
    }

    const cost = equipmentCosts[equipmentType].contracts;
    const legacyCoinCost = equipmentCosts[equipmentType].legacyCoins;
    
    let plain = 0, simple = 0, rare = 0, elite = 0, legacyCoins = 0;

    for (let i = startIdx; i < endIdx; i++) {
      const fromLevel = levels[i];
      
      if (fromLevel === 'creation') plain += cost;
      else if (fromLevel === 'plain') simple += cost;
      else if (fromLevel.startsWith('simple')) simple += cost;
      else if (fromLevel.startsWith('rare')) rare += cost;
      else if (fromLevel.startsWith('elite')) elite += cost;
      else if (fromLevel.startsWith('grand')) {
        elite += cost;
        legacyCoins += legacyCoinCost;
      }
    }

    const totalPlainEquiv = plain + (simple * 4) + (rare * 16) + (elite * 64);

    // Consolidate contracts
    let consolidatedGrand = 0, consolidatedElite = 0, consolidatedRare = 0;
    let consolidatedSimple = 0, consolidatedPlain = 0;
    
    let remainingElite = elite;
    let remainingRare = rare;
    let remainingSimple = simple;
    let remainingPlain = plain;

    consolidatedGrand = Math.floor(remainingElite / 4);
    remainingElite = remainingElite % 4;
    
    const rareToElite = Math.floor(remainingRare / 4);
    remainingElite += rareToElite;
    remainingRare = remainingRare % 4;
    
    const additionalGrand = Math.floor(remainingElite / 4);
    consolidatedGrand += additionalGrand;
    remainingElite = remainingElite % 4;
    consolidatedElite = remainingElite;
    
    const simpleToRare = Math.floor(remainingSimple / 4);
    remainingRare += simpleToRare;
    remainingSimple = remainingSimple % 4;
    consolidatedRare = remainingRare;
    
    const plainToSimple = Math.floor(remainingPlain / 4);
    remainingSimple += plainToSimple;
    remainingPlain = remainingPlain % 4;
    consolidatedSimple = remainingSimple;
    consolidatedPlain = remainingPlain;

    // Consolidate legacy coins to highest grade (same as contracts)
    // Note: Required legacy coins are in Elite grade, but we can have all rarities
    let totalLegacyPlainEquiv = legacyCoins; // Elite Legacy Coins converted to Plain equivalent
    let consolidatedLegacyGrand = 0, consolidatedLegacyElite = 0, consolidatedLegacyRare = 0;
    let consolidatedLegacySimple = 0, consolidatedLegacyPlain = 0;
    
    // Convert Elite grade to Plain grade equivalent for consolidation
    let legacyInPlainEquiv = legacyCoins * 64; // Elite = 64 Plain
    
    consolidatedLegacyGrand = Math.floor(legacyInPlainEquiv / 256);
    legacyInPlainEquiv = legacyInPlainEquiv % 256;
    
    consolidatedLegacyElite = Math.floor(legacyInPlainEquiv / 64);
    legacyInPlainEquiv = legacyInPlainEquiv % 64;
    
    consolidatedLegacyRare = Math.floor(legacyInPlainEquiv / 16);
    legacyInPlainEquiv = legacyInPlainEquiv % 16;
    
    consolidatedLegacySimple = Math.floor(legacyInPlainEquiv / 4);
    legacyInPlainEquiv = legacyInPlainEquiv % 4;
    
    consolidatedLegacyPlain = legacyInPlainEquiv;

    // Calculate owned totals - INCLUDING elite equipment value
    const ownedContractsManual = ownedPlain + (ownedSimple * 4) + (ownedRare * 16) + (ownedElite * 64) + (ownedGrand * 256);
    const ownedTotal = ownedContractsManual + eliteEquipmentPlainContracts;
    
    console.log('Contract Debug:', {
      required: totalPlainEquiv,
      ownedManual: ownedContractsManual,
      ownedEliteEquip: eliteEquipmentPlainContracts,
      ownedTotal: ownedTotal,
      remaining: totalPlainEquiv - ownedTotal
    });
    
    // Legacy coins inventory converted to Plain equivalent
    const ownedLegacyTotal = ownedLegacyPlain + (ownedLegacySimple * 4) + (ownedLegacyRare * 16) + (ownedLegacyElite * 64) + (ownedLegacyGrand * 256);
    
    let remainingNeeded = totalPlainEquiv - ownedTotal;
    if (remainingNeeded < 0) remainingNeeded = 0;
    
    // Calculate remaining legacy needed in Plain equivalent
    // First convert required Elite grade to Plain equivalent
    let totalLegacyInPlainEquiv = legacyCoins * 64; // Elite grade × 64 = Plain equivalent
    let remainingLegacyNeeded = totalLegacyInPlainEquiv - ownedLegacyTotal;
    if (remainingLegacyNeeded < 0) remainingLegacyNeeded = 0;
    
    console.log('Legacy Debug:', {
      required: legacyCoins,
      requiredInPlain: totalLegacyInPlainEquiv,
      owned: ownedLegacyTotal,
      remaining: remainingLegacyNeeded
    });
    
    // Convert remaining contracts needed
    let stillNeedGrand = Math.floor(remainingNeeded / 256);
    remainingNeeded = remainingNeeded % 256;
    let stillNeedElite = Math.floor(remainingNeeded / 64);
    remainingNeeded = remainingNeeded % 64;
    let stillNeedRare = Math.floor(remainingNeeded / 16);
    remainingNeeded = remainingNeeded % 16;
    let stillNeedSimple = Math.floor(remainingNeeded / 4);
    remainingNeeded = remainingNeeded % 4;
    let stillNeedPlain = remainingNeeded;

    // Convert remaining legacy coins needed (same as contracts)
    let stillNeedLegacyGrand = Math.floor(remainingLegacyNeeded / 256);
    remainingLegacyNeeded = remainingLegacyNeeded % 256;
    let stillNeedLegacyElite = Math.floor(remainingLegacyNeeded / 64);
    remainingLegacyNeeded = remainingLegacyNeeded % 64;
    let stillNeedLegacyRare = Math.floor(remainingLegacyNeeded / 16);
    remainingLegacyNeeded = remainingLegacyNeeded % 16;
    let stillNeedLegacySimple = Math.floor(remainingLegacyNeeded / 4);
    remainingLegacyNeeded = remainingLegacyNeeded % 4;
    let stillNeedLegacyPlain = remainingLegacyNeeded;

    return {
      needed: { plain, simple, rare, elite, legacyCoins, totalPlainEquiv, totalLegacyPlainEquiv },
      consolidated: { 
        grand: consolidatedGrand, elite: consolidatedElite, rare: consolidatedRare,
        simple: consolidatedSimple, plain: consolidatedPlain,
        legacyGrand: consolidatedLegacyGrand, legacyElite: consolidatedLegacyElite,
        legacyRare: consolidatedLegacyRare, legacySimple: consolidatedLegacySimple,
        legacyPlain: consolidatedLegacyPlain,
        totalPlainEquiv, totalLegacyPlainEquiv: legacyCoins * 64
      },
      remaining: { 
        grand: stillNeedGrand, elite: stillNeedElite, rare: stillNeedRare,
        simple: stillNeedSimple, plain: stillNeedPlain,
        legacyGrand: stillNeedLegacyGrand, legacyElite: stillNeedLegacyElite,
        legacyRare: stillNeedLegacyRare, legacySimple: stillNeedLegacySimple,
        legacyPlain: stillNeedLegacyPlain,
        totalPlainEquiv: totalPlainEquiv - ownedTotal < 0 ? 0 : totalPlainEquiv - ownedTotal,
        totalLegacyPlainEquiv: totalLegacyInPlainEquiv - ownedLegacyTotal < 0 ? 0 : totalLegacyInPlainEquiv - ownedLegacyTotal
      }
    };
  }, [equipmentType, currentLevel, targetLevel, ownedPlain, ownedSimple, ownedRare, ownedElite, ownedGrand, ownedLegacyPlain, ownedLegacySimple, ownedLegacyRare, ownedLegacyElite, ownedLegacyGrand]);

  return (
    <div className="calculator-container">
      <div className="calculator-wrapper">
        <div className="calculator-card">
          <div className="header">
            <Calculator size={32} className="header-icon" />
            <h1>Godfather Equipment Calculator</h1>
          </div>

          <div className="form-group">
            <label>Equipment Type</label>
            <select value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}>
              <option value="tops">Tops</option>
              <option value="range">Range</option>
              <option value="melee">Melee</option>
              <option value="pants">Pants</option>
              <option value="shoes">Shoes</option>
              <option value="accessory">Accessory</option>
            </select>
          </div>

          <div className="level-selection">
            <div className="form-group">
              <label>Current Level</label>
              <select value={currentLevel} onChange={(e) => setCurrentLevel(e.target.value)}>
                {levels.map(level => (
                  <option key={level} value={level}>{levelNames[level]}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Target Level</label>
              <select value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)}>
                {targetLevels.map(level => (
                  <option key={level} value={level}>{levelNames[level]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="inventory-section">
            <div className="section-header">
              <Package size={20} />
              <h3>Your Current Inventory</h3>
            </div>
            
            <div className="inventory-subsection">
              <div className="subsection-title">Godfather Contracts</div>
              <div className="inventory-grid">
                <div className="input-group">
                  <label>Grand</label>
                  <input type="number" min="0" value={ownedGrand} placeholder="0"
                    onChange={(e) => setOwnedGrand(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group">
                  <label>Elite</label>
                  <input type="number" min="0" value={ownedElite} placeholder="0"
                    onChange={(e) => setOwnedElite(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group">
                  <label>Rare</label>
                  <input type="number" min="0" value={ownedRare} placeholder="0"
                    onChange={(e) => setOwnedRare(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group">
                  <label>Simple</label>
                  <input type="number" min="0" value={ownedSimple} placeholder="0"
                    onChange={(e) => setOwnedSimple(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group">
                  <label>Plain</label>
                  <input type="number" min="0" value={ownedPlain} placeholder="0"
                    onChange={(e) => setOwnedPlain(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group elite-equip-display">
                  <label>Elite Equipment Value</label>
                  <input type="text" value={eliteEquipmentPlainContracts.toLocaleString()} 
                    readOnly className="readonly-input" />
                </div>
              </div>
              <div className="total-owned">
                Total Contracts (Plain Equiv): {(ownedPlain + (ownedSimple * 4) + (ownedRare * 16) + (ownedElite * 64) + (ownedGrand * 256) + eliteEquipmentPlainContracts).toLocaleString()}
              </div>
              <div className="dismantle-note">
                💡 Elite Equipment Dismantle Values: Tops = {dismantleValues.tops}, Range = {dismantleValues.range}, Melee = {dismantleValues.melee}, Pants = {dismantleValues.pants}, Shoes = {dismantleValues.shoes}, Accessory = {dismantleValues.accessory} Plain Contracts
              </div>
            </div>

            <div className="elite-equipment-section">
              <div className="subsection-title">Elite Equipment to dismantle. PLEASE ADD THIS FIRST THEN ADD YOUR CONTRACTS ABOVE TO REFRESH "STILL NEEDED"</div>
              <div className="inventory-grid">
                <div className="input-group">
                  <label>Tops ({dismantleValues.tops})</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={eliteEquipTops === 0 ? '' : eliteEquipTops} 
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setEliteEquipTops(val);
                    }} 
                  />
                </div>
                <div className="input-group">
                  <label>Range ({dismantleValues.range})</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={eliteEquipRange === 0 ? '' : eliteEquipRange} 
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setEliteEquipRange(val);
                    }} 
                  />
                </div>
                <div className="input-group">
                  <label>Melee ({dismantleValues.melee})</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={eliteEquipMelee === 0 ? '' : eliteEquipMelee} 
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setEliteEquipMelee(val);
                    }} 
                  />
                </div>
                <div className="input-group">
                  <label>Pants ({dismantleValues.pants})</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={eliteEquipPants === 0 ? '' : eliteEquipPants} 
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setEliteEquipPants(val);
                    }} 
                  />
                </div>
                <div className="input-group">
                  <label>Shoes ({dismantleValues.shoes})</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={eliteEquipShoes === 0 ? '' : eliteEquipShoes} 
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setEliteEquipShoes(val);
                    }} 
                  />
                </div>
                <div className="input-group">
                  <label>Accessory ({dismantleValues.accessory})</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={eliteEquipAccessory === 0 ? '' : eliteEquipAccessory} 
                    placeholder="0"
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setEliteEquipAccessory(val);
                    }} 
                  />
                </div>
              </div>
              {eliteEquipmentPlainContracts > 0 && (
                <div className="elite-equipment-total">
                  Elite Equipment Value: +{eliteEquipmentPlainContracts.toLocaleString()} Plain Contracts
                </div>
              )}
            </div>

            {requiresLegacyCoins && (
              <div className="legacy-section">
                <div className="section-header">
                  <Coins size={20} />
                  <div className="subsection-title">Legacy Coins</div>
                </div>
                <div className="inventory-grid">
                  <div className="input-group">
                    <label>Grand</label>
                    <input type="number" min="0" value={ownedLegacyGrand} 
                      onChange={(e) => setOwnedLegacyGrand(parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="input-group">
                    <label>Elite</label>
                    <input type="number" min="0" value={ownedLegacyElite} 
                      onChange={(e) => setOwnedLegacyElite(parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="input-group">
                    <label>Rare</label>
                    <input type="number" min="0" value={ownedLegacyRare} 
                      onChange={(e) => setOwnedLegacyRare(parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="input-group">
                    <label>Simple</label>
                    <input type="number" min="0" value={ownedLegacySimple} 
                      onChange={(e) => setOwnedLegacySimple(parseInt(e.target.value) || 0)} />
                  </div>
                  <div className="input-group">
                    <label>Plain</label>
                    <input type="number" min="0" value={ownedLegacyPlain} 
                      onChange={(e) => setOwnedLegacyPlain(parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                <div className="total-owned">
                  Total Legacy Coins (Plain Equiv): {(ownedLegacyPlain + (ownedLegacySimple * 4) + (ownedLegacyRare * 16) + (ownedLegacyElite * 64) + (ownedLegacyGrand * 256)).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {levels.indexOf(currentLevel) >= levels.indexOf(targetLevel) ? (
            <div className="results-section error">
              <p>Please select a target level higher than your current level.</p>
            </div>
          ) : (
            <>
              <div className="results-section">
                <h2>Total Required (Highest Grade)</h2>
                
                <div className="subsection-title" style={{marginBottom: '12px', color: '#d1d5db'}}>Godfather Contracts</div>
                <div className="stats-grid">
                  {calculations.consolidated.grand > 0 && (
                    <div className="stat-card grand">
                      <div className="stat-label">Grand Contracts</div>
                      <div className="stat-value">{calculations.consolidated.grand}</div>
                    </div>
                  )}
                  {calculations.consolidated.elite > 0 && (
                    <div className="stat-card elite">
                      <div className="stat-label">Elite Contracts</div>
                      <div className="stat-value">{calculations.consolidated.elite}</div>
                    </div>
                  )}
                  {calculations.consolidated.rare > 0 && (
                    <div className="stat-card rare">
                      <div className="stat-label">Rare Contracts</div>
                      <div className="stat-value">{calculations.consolidated.rare}</div>
                    </div>
                  )}
                  {calculations.consolidated.simple > 0 && (
                    <div className="stat-card simple">
                      <div className="stat-label">Simple Contracts</div>
                      <div className="stat-value">{calculations.consolidated.simple}</div>
                    </div>
                  )}
                  {calculations.consolidated.plain > 0 && (
                    <div className="stat-card plain">
                      <div className="stat-label">Plain Contracts</div>
                      <div className="stat-value">{calculations.consolidated.plain}</div>
                    </div>
                  )}
                </div>
                <div className="total-box">
                  <div className="stat-label">Total Contracts (Plain Equivalent)</div>
                  <div className="total-value">{calculations.consolidated.totalPlainEquiv.toLocaleString()}</div>
                </div>

                {requiresLegacyCoins && (
                  <>
                    <div className="subsection-title" style={{marginTop: '24px', marginBottom: '12px', color: '#fcd34d', display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <Coins size={18} /> Legacy Coins
                    </div>
                    <div className="stats-grid">
                      {calculations.consolidated.legacyGrand > 0 && (
                        <div className="stat-card legacy">
                          <div className="stat-label">Grand Legacy</div>
                          <div className="stat-value">{calculations.consolidated.legacyGrand}</div>
                        </div>
                      )}
                      {calculations.consolidated.legacyElite > 0 && (
                        <div className="stat-card legacy">
                          <div className="stat-label">Elite Legacy</div>
                          <div className="stat-value">{calculations.consolidated.legacyElite}</div>
                        </div>
                      )}
                      {calculations.consolidated.legacyRare > 0 && (
                        <div className="stat-card legacy">
                          <div className="stat-label">Rare Legacy</div>
                          <div className="stat-value">{calculations.consolidated.legacyRare}</div>
                        </div>
                      )}
                      {calculations.consolidated.legacySimple > 0 && (
                        <div className="stat-card legacy">
                          <div className="stat-label">Simple Legacy</div>
                          <div className="stat-value">{calculations.consolidated.legacySimple}</div>
                        </div>
                      )}
                      {calculations.consolidated.legacyPlain > 0 && (
                        <div className="stat-card legacy">
                          <div className="stat-label">Plain Legacy</div>
                          <div className="stat-value">{calculations.consolidated.legacyPlain}</div>
                        </div>
                      )}
                    </div>
                    <div className="total-box">
                      <div className="stat-label">Total Legacy Coins (Plain Equivalent)</div>
                      <div className="total-value">{calculations.consolidated.totalLegacyPlainEquiv.toLocaleString()}</div>
                      <div className="stat-label" style={{marginTop: '8px', fontSize: '11px', color: '#9ca3af'}}>
                        ({(calculations.consolidated.totalLegacyPlainEquiv / 64).toFixed(0)} Elite Grade)
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="results-section remaining">
                <h2>Still Needed (After Using Your Inventory)</h2>
                {calculations.remaining.totalPlainEquiv === 0 && calculations.remaining.totalLegacyPlainEquiv === 0 ? (
                  <div className="success-message">✓ You have enough materials!</div>
                ) : (
                  <>
                    {calculations.remaining.totalPlainEquiv > 0 && (
                      <>
                        <div className="subsection-title" style={{marginBottom: '12px', color: '#d1d5db'}}>Godfather Contracts</div>
                        <div className="stats-grid">
                          {calculations.remaining.grand > 0 && (
                            <div className="stat-card grand">
                              <div className="stat-label">Grand Contracts</div>
                              <div className="stat-value">{calculations.remaining.grand}</div>
                            </div>
                          )}
                          {calculations.remaining.elite > 0 && (
                            <div className="stat-card elite">
                              <div className="stat-label">Elite Contracts</div>
                              <div className="stat-value">{calculations.remaining.elite}</div>
                            </div>
                          )}
                          {calculations.remaining.rare > 0 && (
                            <div className="stat-card rare">
                              <div className="stat-label">Rare Contracts</div>
                              <div className="stat-value">{calculations.remaining.rare}</div>
                            </div>
                          )}
                          {calculations.remaining.simple > 0 && (
                            <div className="stat-card simple">
                              <div className="stat-label">Simple Contracts</div>
                              <div className="stat-value">{calculations.remaining.simple}</div>
                            </div>
                          )}
                          {calculations.remaining.plain > 0 && (
                            <div className="stat-card plain">
                              <div className="stat-label">Plain Contracts</div>
                              <div className="stat-value">{calculations.remaining.plain}</div>
                            </div>
                          )}
                        </div>
                        <div className="total-box">
                          <div className="stat-label">Still Needed Contracts (Plain Equivalent)</div>
                          <div className="total-value">{calculations.remaining.totalPlainEquiv.toLocaleString()}</div>
                        </div>
                      </>
                    )}

                    {calculations.remaining.totalLegacyPlainEquiv > 0 && (
                      <>
                        <div className="subsection-title" style={{marginTop: '24px', marginBottom: '12px', color: '#fcd34d', display: 'flex', alignItems: 'center', gap: '8px'}}>
                          <Coins size={18} /> Legacy Coins
                        </div>
                        <div className="stats-grid">
                          {calculations.remaining.legacyGrand > 0 && (
                            <div className="stat-card legacy">
                              <div className="stat-label">Grand Legacy</div>
                              <div className="stat-value">{calculations.remaining.legacyGrand}</div>
                            </div>
                          )}
                          {calculations.remaining.legacyElite > 0 && (
                            <div className="stat-card legacy">
                              <div className="stat-label">Elite Legacy</div>
                              <div className="stat-value">{calculations.remaining.legacyElite}</div>
                            </div>
                          )}
                          {calculations.remaining.legacyRare > 0 && (
                            <div className="stat-card legacy">
                              <div className="stat-label">Rare Legacy</div>
                              <div className="stat-value">{calculations.remaining.legacyRare}</div>
                            </div>
                          )}
                          {calculations.remaining.legacySimple > 0 && (
                            <div className="stat-card legacy">
                              <div className="stat-label">Simple Legacy</div>
                              <div className="stat-value">{calculations.remaining.legacySimple}</div>
                            </div>
                          )}
                          {calculations.remaining.legacyPlain > 0 && (
                            <div className="stat-card legacy">
                              <div className="stat-label">Plain Legacy</div>
                              <div className="stat-value">{calculations.remaining.legacyPlain}</div>
                            </div>
                          )}
                        </div>
                        <div className="total-box">
                          <div className="stat-label">Still Needed Legacy Coins (Plain Equivalent)</div>
                          <div className="total-value">{calculations.remaining.totalLegacyPlainEquiv.toLocaleString()}</div>
                          <div className="stat-label" style={{marginTop: '8px', fontSize: '11px', color: '#9ca3af'}}>
                            ({(calculations.remaining.totalLegacyPlainEquiv / 64).toFixed(0)} Elite Grade)
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          <div className="info-section">
            <div className="section-header">
              <Info size={20} />
              <h3>Contract & Legacy Coin Conversions</h3>
            </div>
            <div className="conversions">
              <div>1 Simple = 4 Plain</div>
              <div>1 Rare = 4 Simple (16 Plain)</div>
              <div>1 Elite = 4 Rare (64 Plain)</div>
              <div>1 Grand = 4 Elite (256 Plain)</div>
            </div>
            <div className="note">
              * All legacy coin numbers shown are in Plain Equivalent format (same as contracts). Legacy coins are required in Elite grade from Grand+1 onwards ({equipmentCosts[equipmentType].legacyCoins} Elite grade per upgrade). Conversion: 1 Simple = 4 Plain, 1 Rare = 4 Simple (16 Plain), 1 Elite = 4 Rare (64 Plain), 1 Grand = 4 Elite (256 Plain)
            </div>
          </div>

          <div className="dismantle-section">
            <h3>Elite Equipment Dismantle Value</h3>
            <div className="dismantle-value">
              {equipmentType.charAt(0).toUpperCase() + equipmentType.slice(1)}: {dismantleValues[equipmentType]} Plain Contracts
            </div>
          </div>
        </div>
        
        <div className="footer-support">
          <p>
            💜 Enjoyed this calculator? Support the creator by subscribing to{' '}
            <a href="https://www.youtube.com/c/Kserske" target="_blank" rel="noopener noreferrer">
              Kserske's YouTube Channel
            </a>
            {' '}and consider donating via YouTube comments!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GodfatherCalculator;