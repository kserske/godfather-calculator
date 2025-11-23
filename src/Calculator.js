import React, { useState, useMemo } from 'react';
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
  const [ownedLegacyCoins, setOwnedLegacyCoins] = useState(0);

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
    'creation': 'Creation', 'plain': 'Plain', 'simple': 'Simple',
    'simple+1': 'Simple +1', 'simple+2': 'Simple +2', 'simple+3': 'Simple +3',
    'rare': 'Rare', 'rare+1': 'Rare +1', 'rare+2': 'Rare +2', 'rare+3': 'Rare +3',
    'elite': 'Elite', 'elite+1': 'Elite +1', 'elite+2': 'Elite +2', 'elite+3': 'Elite +3',
    'grand': 'Grand', 'grand+1': 'Grand +1', 'grand+2': 'Grand +2', 'grand+3': 'Grand +3',
    'legacy': 'Legacy'
  };

  const requiresLegacyCoins = useMemo(() => {
    const targetIdx = levels.indexOf(targetLevel);
    const grandPlusOneIdx = levels.indexOf('grand+1');
    return targetIdx >= grandPlusOneIdx;
  }, [targetLevel]);

  const calculations = useMemo(() => {
    const startIdx = levels.indexOf(currentLevel);
    const endIdx = levels.indexOf(targetLevel);
    
    if (startIdx >= endIdx) {
      return { 
        needed: { plain: 0, simple: 0, rare: 0, elite: 0, legacyCoins: 0, totalPlainEquiv: 0 },
        consolidated: { grand: 0, elite: 0, rare: 0, simple: 0, plain: 0, legacyCoins: 0, totalPlainEquiv: 0 },
        remaining: { grand: 0, elite: 0, rare: 0, simple: 0, plain: 0, legacyCoins: 0, totalPlainEquiv: 0 }
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

    const ownedTotal = ownedPlain + (ownedSimple * 4) + (ownedRare * 16) + (ownedElite * 64) + (ownedGrand * 256);
    let remainingNeeded = totalPlainEquiv - ownedTotal;
    if (remainingNeeded < 0) remainingNeeded = 0;
    
    let stillNeedGrand = Math.floor(remainingNeeded / 256);
    remainingNeeded = remainingNeeded % 256;
    let stillNeedElite = Math.floor(remainingNeeded / 64);
    remainingNeeded = remainingNeeded % 64;
    let stillNeedRare = Math.floor(remainingNeeded / 16);
    remainingNeeded = remainingNeeded % 16;
    let stillNeedSimple = Math.floor(remainingNeeded / 4);
    remainingNeeded = remainingNeeded % 4;
    let stillNeedPlain = remainingNeeded;

    const stillNeedLegacyCoins = legacyCoins - ownedLegacyCoins < 0 ? 0 : legacyCoins - ownedLegacyCoins;

    return {
      needed: { plain, simple, rare, elite, legacyCoins, totalPlainEquiv },
      consolidated: { 
        grand: consolidatedGrand, elite: consolidatedElite, rare: consolidatedRare,
        simple: consolidatedSimple, plain: consolidatedPlain, legacyCoins, totalPlainEquiv 
      },
      remaining: { 
        grand: stillNeedGrand, elite: stillNeedElite, rare: stillNeedRare,
        simple: stillNeedSimple, plain: stillNeedPlain, legacyCoins: stillNeedLegacyCoins,
        totalPlainEquiv: totalPlainEquiv - ownedTotal < 0 ? 0 : totalPlainEquiv - ownedTotal
      }
    };
  }, [equipmentType, currentLevel, targetLevel, ownedPlain, ownedSimple, ownedRare, ownedElite, ownedGrand, ownedLegacyCoins]);

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
                {levels.map(level => (
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
                  <input type="number" min="0" value={ownedGrand} 
                    onChange={(e) => setOwnedGrand(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group">
                  <label>Elite</label>
                  <input type="number" min="0" value={ownedElite} 
                    onChange={(e) => setOwnedElite(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group">
                  <label>Rare</label>
                  <input type="number" min="0" value={ownedRare} 
                    onChange={(e) => setOwnedRare(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group">
                  <label>Simple</label>
                  <input type="number" min="0" value={ownedSimple} 
                    onChange={(e) => setOwnedSimple(parseInt(e.target.value) || 0)} />
                </div>
                <div className="input-group">
                  <label>Plain</label>
                  <input type="number" min="0" value={ownedPlain} 
                    onChange={(e) => setOwnedPlain(parseInt(e.target.value) || 0)} />
                </div>
              </div>
              <div className="total-owned">
                Total Contracts (Plain Equiv): {(ownedPlain + (ownedSimple * 4) + (ownedRare * 16) + (ownedElite * 64) + (ownedGrand * 256)).toLocaleString()}
              </div>
            </div>

            {requiresLegacyCoins && (
              <div className="legacy-section">
                <div className="section-header">
                  <Coins size={20} />
                  <div className="subsection-title">Elite Legacy Coins</div>
                </div>
                <input type="number" min="0" className="legacy-input"
                  value={ownedLegacyCoins} placeholder="Enter your legacy coins"
                  onChange={(e) => setOwnedLegacyCoins(parseInt(e.target.value) || 0)} />
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
                  {calculations.consolidated.legacyCoins > 0 && (
                    <div className="stat-card legacy">
                      <div className="stat-label">
                        <Coins size={16} /> Elite Legacy Coins
                      </div>
                      <div className="stat-value">{calculations.consolidated.legacyCoins}</div>
                    </div>
                  )}
                </div>
                <div className="total-box">
                  <div className="stat-label">Total Contracts (Plain Equivalent)</div>
                  <div className="total-value">{calculations.consolidated.totalPlainEquiv.toLocaleString()}</div>
                </div>
              </div>

              <div className="results-section remaining">
                <h2>Still Needed (After Using Your Inventory)</h2>
                {calculations.remaining.totalPlainEquiv === 0 && calculations.remaining.legacyCoins === 0 ? (
                  <div className="success-message">✓ You have enough materials!</div>
                ) : (
                  <>
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
                      {calculations.remaining.legacyCoins > 0 && (
                        <div className="stat-card legacy">
                          <div className="stat-label">
                            <Coins size={16} /> Elite Legacy Coins
                          </div>
                          <div className="stat-value">{calculations.remaining.legacyCoins}</div>
                        </div>
                      )}
                    </div>
                    {calculations.remaining.totalPlainEquiv > 0 && (
                      <div className="total-box">
                        <div className="stat-label">Still Needed Contracts (Plain Equivalent)</div>
                        <div className="total-value">{calculations.remaining.totalPlainEquiv.toLocaleString()}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          <div className="info-section">
            <div className="section-header">
              <Info size={20} />
              <h3>Contract Conversions</h3>
            </div>
            <div className="conversions">
              <div>1 Simple = 4 Plain</div>
              <div>1 Rare = 4 Simple (16 Plain)</div>
              <div>1 Elite = 4 Rare (64 Plain)</div>
              <div>1 Grand = 4 Elite (256 Plain)</div>
            </div>
            <div className="note">
              * Legacy coins required from Grand+1 onwards ({equipmentCosts[equipmentType].legacyCoins} per upgrade)
            </div>
          </div>

          <div className="dismantle-section">
            <h3>Elite Equipment Dismantle Value</h3>
            <div className="dismantle-value">
              {equipmentType.charAt(0).toUpperCase() + equipmentType.slice(1)}: {dismantleValues[equipmentType]} Plain Contracts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GodfatherCalculator;