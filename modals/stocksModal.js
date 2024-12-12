class StocksModal {
    constructor() {
        this.modal = null;
        this.confirmationModal = null;
        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = 'stocksModal';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.maxWidth = '1000px';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.className = 'modal-close';
        closeBtn.onclick = () => this.hide();

        const columnsContainer = document.createElement('div');
        columnsContainer.style.cssText = `
            display: flex;
            gap: 30px;
            margin-top: 20px;
            height: calc(80vh - 100px);
            overflow: hidden;
        `;

        // Left Column - Add New Stock Form
        const leftColumn = document.createElement('div');
        leftColumn.style.cssText = `
            flex: 0 0 35%;
            padding: 20px;
            background: rgba(13, 17, 23, 0.95);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            overflow-y: auto;
            max-height: 100%;
        `;

        const addHeader = document.createElement('h2');
        addHeader.textContent = 'Add New Stock';
        addHeader.style.cssText = `
            margin: 0 0 25px 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.5em;
            font-weight: 600;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        `;

        const form = document.createElement('form');
        form.className = 'modal-form';

        const fields = [
            { label: 'Symbol', type: 'select', id: 'stockSymbol', required: true },
            { label: 'Shares', type: 'number', id: 'stockQuantity', required: true, step: 'any', min: '0' },
            { label: 'Principal ($)', type: 'number', id: 'stockPrincipal', required: true, step: 'any', min: '0' }
        ];

        fields.forEach(field => {
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'form-field';

            const label = document.createElement('label');
            label.textContent = field.label;
            label.htmlFor = field.id;
            label.className = 'form-label';

            let input;
            if (field.type === 'select') {
                input = document.createElement('select');
                Object.keys(window.ENV.stockShares).forEach(symbol => {
                    const option = document.createElement('option');
                    option.value = symbol;
                    option.textContent = symbol;
                    input.appendChild(option);
                });
                input.onchange = () => {
                    const symbol = input.value;
                    document.getElementById('stockQuantity').value = window.ENV.stockShares[symbol] || '';
                    document.getElementById('stockPrincipal').value = window.ENV.stockPrincipals[symbol] || '';
                };
            } else {
                input = document.createElement('input');
                input.type = field.type;
                if (field.step) input.step = field.step;
                if (field.min) input.min = field.min;
            }
            
            input.id = field.id;
            input.required = field.required;
            input.className = field.type === 'select' ? 'form-select' : 'form-input';

            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            form.appendChild(fieldContainer);
        });

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Add Stock';
        submitBtn.type = 'submit';
        submitBtn.className = 'modal-button';
        form.appendChild(submitBtn);

        form.onsubmit = (e) => this.handleSubmit(e);

        // Right Column - Update Stock Quantities
        const rightColumn = document.createElement('div');
        rightColumn.style.cssText = `
            flex: 1;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 12px;
            padding: 25px;
            overflow-y: auto;
            max-height: 600px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;

        const portfolioHeader = document.createElement('h2');
        portfolioHeader.textContent = 'Update Stock Portfolio';
        portfolioHeader.style.cssText = `
            margin: 0 0 25px 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.5em;
            font-weight: 600;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        `;

        const portfolioList = document.createElement('div');
        portfolioList.id = 'stocksPortfolioList';

        rightColumn.appendChild(portfolioHeader);
        rightColumn.appendChild(portfolioList);

        leftColumn.appendChild(addHeader);
        leftColumn.appendChild(form);

        columnsContainer.appendChild(leftColumn);
        columnsContainer.appendChild(rightColumn);

        modalContent.appendChild(closeBtn);
        modalContent.appendChild(columnsContainer);
        this.modal.appendChild(modalContent);

        document.body.appendChild(this.modal);
        this.updatePortfolioList();

        // Set initial values for the first symbol
        const firstSymbol = Object.keys(window.ENV.stockShares)[0];
        if (firstSymbol) {
            document.getElementById('stockQuantity').value = window.ENV.stockShares[firstSymbol] || '';
            document.getElementById('stockPrincipal').value = window.ENV.stockPrincipals[firstSymbol] || '';
        }
    }

    updatePortfolioList() {
        const portfolioList = document.getElementById('stocksPortfolioList');
        portfolioList.innerHTML = '';

        Object.entries(window.ENV.stockShares).forEach(([symbol, shares]) => {
            if (shares > 0) {
                const positionItem = document.createElement('div');
                positionItem.style.cssText = `
                    display: grid;
                    grid-template-columns: 100px auto auto 100px;
                    gap: 15px;
                    align-items: center;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 8px;
                    margin-bottom: 10px;
                    transition: all 0.2s ease;
                `;

                // Symbol
                const symbolDiv = document.createElement('div');
                symbolDiv.style.cssText = `
                    font-weight: 500;
                    color: #fff;
                `;
                symbolDiv.textContent = symbol;

                // Shares Input with Save Button Container
                const sharesContainer = document.createElement('div');
                sharesContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `;

                const sharesInput = document.createElement('input');
                sharesInput.type = 'number';
                sharesInput.step = 'any';
                sharesInput.min = '0';
                sharesInput.value = shares;
                sharesInput.className = 'form-input';
                sharesInput.style.width = '120px';

                const saveSharesBtn = document.createElement('button');
                saveSharesBtn.innerHTML = '💾';
                saveSharesBtn.style.cssText = `
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--primary-color);
                    border-radius: 4px;
                    background: transparent;
                    color: white;
                    cursor: pointer;
                `;
                saveSharesBtn.onclick = () => {
                    const newShares = Math.max(0, parseFloat(sharesInput.value) || 0);
                    sharesInput.value = newShares;
                    window.ENV.stockShares[symbol] = newShares;
                    window.saveEnvToLocalStorage();
                    if (typeof updateStockPrices === 'function') {
                        updateStockPrices();
                    }
                    
                    saveSharesBtn.innerHTML = '✓';
                    setTimeout(() => {
                        saveSharesBtn.innerHTML = '💾';
                    }, 1000);
                };

                sharesContainer.appendChild(sharesInput);
                sharesContainer.appendChild(saveSharesBtn);

                // Principal Input with Save Button
                const principalContainer = document.createElement('div');
                principalContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                `;

                const principalInput = document.createElement('input');
                principalInput.type = 'number';
                principalInput.step = 'any';
                principalInput.min = '0';
                principalInput.value = window.ENV.stockPrincipals[symbol] || 0;
                principalInput.className = 'form-input';
                principalInput.style.width = '120px';

                const savePrincipalBtn = document.createElement('button');
                savePrincipalBtn.innerHTML = '💾';
                savePrincipalBtn.style.cssText = `
                    width: 32px;
                    height: 32px;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--primary-color);
                    border-radius: 4px;
                    background: transparent;
                    color: white;
                    cursor: pointer;
                `;
                savePrincipalBtn.onclick = () => {
                    const newPrincipal = Math.max(0, parseFloat(principalInput.value) || 0);
                    principalInput.value = newPrincipal;
                    window.ENV.stockPrincipals[symbol] = newPrincipal;
                    window.saveEnvToLocalStorage();
                    if (typeof updateStockPrices === 'function') {
                        updateStockPrices();
                    }
                    this.updateDelta(deltaDiv, symbol);
                    savePrincipalBtn.innerHTML = '✓';
                    setTimeout(() => {
                        savePrincipalBtn.innerHTML = '💾';
                    }, 1000);
                };

                principalContainer.appendChild(principalInput);
                principalContainer.appendChild(savePrincipalBtn);

                // Delta Display
                const deltaDiv = document.createElement('div');
                deltaDiv.style.cssText = `
                    font-weight: 500;
                    text-align: right;
                `;
                this.updateDelta(deltaDiv, symbol);

                positionItem.appendChild(symbolDiv);
                positionItem.appendChild(sharesContainer);
                positionItem.appendChild(principalContainer);
                positionItem.appendChild(deltaDiv);
                portfolioList.appendChild(positionItem);
            }
        });
    }

    updateDelta(deltaDiv, symbol) {
        const shares = window.ENV.stockShares[symbol];
        const principal = window.ENV.stockPrincipals[symbol] || 0;
        const currentPrice = window.stockPrices?.[symbol]?.price || 0;
        const currentValue = shares * currentPrice;
        const delta = currentValue - principal;
        
        deltaDiv.textContent = delta.toFixed(2);
        deltaDiv.style.color = delta >= 0 ? '#00ff00' : '#ff4444';
    }

    handleSubmit(e) {
        e.preventDefault();

        const symbol = document.getElementById('stockSymbol').value;
        const shares = Math.max(0, parseFloat(document.getElementById('stockQuantity').value) || 0);
        const principal = Math.max(0, parseFloat(document.getElementById('stockPrincipal').value) || 0);

        // Update values in ENV
        window.ENV.stockShares[symbol] = shares;
        window.ENV.stockPrincipals[symbol] = principal;

        // Save to localStorage
        window.saveEnvToLocalStorage();

        const successMsg = document.createElement('div');
        successMsg.textContent = 'Stock added successfully!';
        successMsg.style.cssText = `
            color: #00C851;
            margin-top: 10px;
            font-size: 0.9em;
            text-align: center;
            animation: fadeIn 0.2s ease-out;
        `;
        e.target.appendChild(successMsg);

        // Update displays
        this.updatePortfolioList();
        if (typeof updateStockPrices === 'function') {
            updateStockPrices();
        }

        setTimeout(() => {
            successMsg.remove();
        }, 1500);
    }

    show() {
        this.modal.style.display = 'block';
        this.updatePortfolioList();
    }

    hide() {
        this.modal.style.display = 'none';
    }
}

// Initialize stocks modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stocksModal = new StocksModal();
});
