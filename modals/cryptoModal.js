// Crypto Modal Component
class CryptoModal {
    constructor() {
        this.modal = null;
        this.confirmationModal = null;
        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'modal';
        this.modal.id = 'cryptoModal';

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

        // Left Column - Add New Entry Form
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
        addHeader.textContent = 'Update Crypto Asset';
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
            { label: 'Symbol', type: 'select', id: 'cryptoSymbol', required: true },
            { label: 'Quantity', type: 'number', id: 'cryptoQuantity', required: true, step: 'any' },
            { label: 'Principal ($)', type: 'number', id: 'cryptoPrincipal', required: true, step: 'any' }
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
                Object.keys(window.ENV.cryptoQuantities).forEach(symbol => {
                    const option = document.createElement('option');
                    option.value = symbol;
                    option.textContent = symbol;
                    input.appendChild(option);
                });
                input.onchange = () => {
                    const symbol = input.value;
                    document.getElementById('cryptoQuantity').value = window.ENV.cryptoQuantities[symbol] || '';
                    document.getElementById('cryptoPrincipal').value = window.ENV.cryptoPrincipals[symbol] || '';
                };
            } else {
                input = document.createElement('input');
                input.type = field.type;
                if (field.step) input.step = field.step;
            }
            
            input.id = field.id;
            input.required = field.required;
            input.className = field.type === 'select' ? 'form-select' : 'form-input';

            fieldContainer.appendChild(label);
            fieldContainer.appendChild(input);
            form.appendChild(fieldContainer);
        });

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'Update Asset';
        submitBtn.type = 'submit';
        submitBtn.className = 'modal-button';
        submitBtn.style.cssText = `
            width: 100%;
            margin-top: 20px;
            padding: 12px;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        form.appendChild(submitBtn);

        form.onsubmit = (e) => this.handleSubmit(e);

        // Right Column - Portfolio List
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
        portfolioHeader.textContent = 'Crypto Portfolio';
        portfolioHeader.style.cssText = `
            margin: 0 0 25px 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.5em;
            font-weight: 600;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        `;

        const portfolioList = document.createElement('div');
        portfolioList.id = 'cryptoPortfolioList';

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
        const firstSymbol = Object.keys(window.ENV.cryptoQuantities)[0];
        if (firstSymbol) {
            document.getElementById('cryptoQuantity').value = window.ENV.cryptoQuantities[firstSymbol] || '';
            document.getElementById('cryptoPrincipal').value = window.ENV.cryptoPrincipals[firstSymbol] || '';
        }
    }

    updatePortfolioList() {
        const portfolioList = document.getElementById('cryptoPortfolioList');
        portfolioList.innerHTML = '';

        Object.entries(window.ENV.cryptoQuantities).forEach(([symbol, quantity]) => {
            const assetItem = document.createElement('div');
            assetItem.style.cssText = `
                display: grid;
                grid-template-columns: 100px auto auto 100px;
                gap: 15px;
                align-items: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                margin-bottom: 10px;
            `;

            // Symbol
            const symbolDiv = document.createElement('div');
            symbolDiv.style.cssText = `
                font-weight: 600;
                color: #fff;
            `;
            symbolDiv.textContent = symbol;

            // Quantity Input with Save Button
            const quantityContainer = document.createElement('div');
            quantityContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
            `;

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.step = 'any';
            quantityInput.value = quantity;
            quantityInput.className = 'form-input';
            quantityInput.style.width = '120px';

            const saveQuantityBtn = document.createElement('button');
            saveQuantityBtn.innerHTML = '💾';
            saveQuantityBtn.style.cssText = `
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
            saveQuantityBtn.onclick = () => {
                const newQuantity = parseFloat(quantityInput.value) || 0;
                window.ENV.cryptoQuantities[symbol] = newQuantity;
                window.saveEnvToLocalStorage();
                if (typeof updateCryptoPrices === 'function') {
                    updateCryptoPrices();
                }
                saveQuantityBtn.innerHTML = '✓';
                setTimeout(() => saveQuantityBtn.innerHTML = '💾', 1000);
            };

            quantityContainer.appendChild(quantityInput);
            quantityContainer.appendChild(saveQuantityBtn);

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
            principalInput.value = window.ENV.cryptoPrincipals[symbol] || 0;
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
                const newPrincipal = parseFloat(principalInput.value) || 0;
                window.ENV.cryptoPrincipals[symbol] = newPrincipal;
                window.saveEnvToLocalStorage();
                if (typeof updateCryptoPrices === 'function') {
                    updateCryptoPrices();
                }
                savePrincipalBtn.innerHTML = '✓';
                setTimeout(() => savePrincipalBtn.innerHTML = '💾', 1000);
            };

            principalContainer.appendChild(principalInput);
            principalContainer.appendChild(savePrincipalBtn);

            // Delta Display
            const deltaDiv = document.createElement('div');
            deltaDiv.style.cssText = `
                font-weight: 500;
                text-align: right;
            `;
            deltaDiv.textContent = '$' + (window.cryptoPrices?.[symbol]?.price * quantity - window.ENV.cryptoPrincipals[symbol] || 0).toFixed(2);
            deltaDiv.style.color = deltaDiv.textContent.startsWith('$-') ? '#ff4444' : '#00ff00';

            assetItem.appendChild(symbolDiv);
            assetItem.appendChild(quantityContainer);
            assetItem.appendChild(principalContainer);
            assetItem.appendChild(deltaDiv);
            portfolioList.appendChild(assetItem);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const symbol = document.getElementById('cryptoSymbol').value;
        const quantity = parseFloat(document.getElementById('cryptoQuantity').value) || 0;
        const principal = parseFloat(document.getElementById('cryptoPrincipal').value) || 0;

        // Update values in ENV
        window.ENV.cryptoQuantities[symbol] = quantity;
        window.ENV.cryptoPrincipals[symbol] = principal;

        // Save to localStorage
        window.saveEnvToLocalStorage();

        // Update displays
        this.updatePortfolioList();
        if (typeof updateCryptoPrices === 'function') {
            updateCryptoPrices();
        }

        const successMsg = document.createElement('div');
        successMsg.textContent = 'Asset updated successfully!';
        successMsg.style.cssText = `
            color: #00C851;
            margin-top: 10px;
            font-size: 0.9em;
            text-align: center;
            animation: fadeIn 0.2s ease-out;
        `;
        e.target.appendChild(successMsg);

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

// Initialize crypto modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cryptoModal = new CryptoModal();
});
