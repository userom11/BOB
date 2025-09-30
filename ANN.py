import sqlite3
import numpy as np
from kan import *

# conn = sqlite3.connect('thedbb.db')
# cursor = conn.cursor
# cursor.execute('''CREATE TABLE IF NOT EXISTS symptomlogs (id INTEGER PRIMARY KEY,timestamp INT, uuid TEXT, cough BIT, fever BIT, nausea BIT, breathing BIT, tiredness BIT, mood BIT, massloss BIT, pain BIT, x INT, y INT)''')

def spreadingAlg(loc, widthOfBreakOut):
    loc = loc
    w = widthOfBreakOut
    scale = 0.5
    x = 10 # 100
    DH = ( x*np.sqrt(2) )  - x
    DH = np.rint(DH).astype(int)
    PAD = np.sqrt((DH**2)/2) # convert this to natural number
    PAD = np.rint(PAD).astype(int)
    b_size = x + (PAD*2)
    b = np.random.normal(loc, scale, (b_size, b_size))
    a = b[PAD-1:PAD-1+x, PAD-1:PAD-1+x] # actual map
    pz = np.random.randint(1, w, 100)
    az = [a]
    for p in pz:
        ai1 = (b[PAD-1-p:PAD-1+x-p, PAD-1+p:PAD-1+x+p])*(0.2) # north east fake spread square # select north eastern + divide 5 to account for 5 sumations of same range
        ai2 = (b[PAD-1+p:PAD-1+x+p, PAD-1+p:PAD-1+x+p])*(0.2) # south east ..
        ai3 = (b[PAD-1+p:PAD-1+x+p, PAD-1-p:PAD-1+x-p])*(0.2) # south west ..
        ai4 = (b[PAD-1-p:PAD-1+x-p, PAD-1-p:PAD-1+x-p])*(0.2) # north west ..
        c = np.random.normal(loc, scale, (x,x))*(0.2)
        a = c + ai1 + ai2 + ai3 + ai4
        az.append(a)
    return az

virusesTodo = ["A", "B", "C", "D"]
symptomsTodo = ["cough", "fever", "nausea", "breathing", "tiredness", "mood", "massloss"]
viruses = [] # Hold viruses(4) > symptoms(7) > geo (9) > 100x100 matrix (symptom true/false as spectrum)

# Place holders used
symptoms = []
geo = []

GeoSpreadProbabilities = [1] # Spread rate each 100 area block group(9)
SpreadWidths           = [2] # Spread width each 100 area block group(9)

for virus in virusesTodo:
    if virus == "A":
        DiseaseSpreadProbability = 1
    if virus == "B":
        DiseaseSpreadProbability = 2
    if virus == "C":
        DiseaseSpreadProbability = 4
    if virus == "D":
        DiseaseSpreadProbability = 8
        
    for symptom in symptomsTodo:
        for GeoSpreadProbability,widthOfBreakOut in zip(GeoSpreadProbabilities, SpreadWidths):
            loc = GeoSpreadProbability*DiseaseSpreadProbability
            geo.append(spreadingAlg(loc, widthOfBreakOut))
        symptoms.append(geo)
    viruses.append(symptoms)

device = torch.device('cpu')


A = (((viruses[0])[0])[0]) + (((viruses[1])[0])[0]) + (((viruses[2])[0])[0]) + (((viruses[3])[0])[0])
np.random.shuffle(A)

data = []
labels = []
for i in range(4):
    mats = ((viruses[i])[0])[0]  # adjust indexing if needed
    for m in mats:
        data.append(m)
        labels.append(i)
data = np.array(data)
labels = np.array(labels)
idx = np.random.permutation(len(data))
data = data[idx]
labels = labels[idx]
data = [m.flatten() for m in data]  # each matrix → 1D array
data = np.array(data)               # optional: convert to NumPy array
print(data[0].shape)

dataset = {}
train_input = np.array(data[:320])
train_label = np.array(labels[:320])
test_input = np.array(data[320:])
test_label = np.array(labels[320:])
dtype = torch.get_default_dtype()


dataset['train_input'] = torch.from_numpy(train_input).type(dtype).to(device)
dataset['train_label'] = torch.from_numpy(train_label[:,None]).type(dtype).to(device)
dataset['test_input'] = torch.from_numpy(test_input).type(dtype).to(device)
dataset['test_label'] = torch.from_numpy(test_label[:,None]).type(dtype).to(device)

model = KAN(width=[10,8,4,4,4], grid=1, k=1, device=device)

losses=[]
def train_acc():
    return torch.mean((torch.round(model(dataset['train_input'])[:,0]) == dataset['train_label'][:,0]).type(dtype))
def test_acc():
    return torch.mean((torch.round(model(dataset['test_input'])[:,0]) == dataset['test_label'][:,0]).type(dtype))

results = model.fit(dataset, opt="LBFGS", steps=891, metrics=(train_acc, test_acc));
results['train_acc'][-1], results['test_acc'][-1]
losses += (results['train_loss'])

y = [point for point in losses]
x = [h for h in range(len(losses))]
plt.scatter(x, y)
plt.xlabel('Training Examples Completed')
plt.ylabel('Mean Squared Error')
plt.title('Scattered Loss at points of Learning')
plt.show()

# cursor.execute(''' INSERT INTO symptomlogs (time, uuid, cough, fever, nausea, breathing, tiredness, mood, massloss, pain, x, y) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''', (time, int_index, symptoms, location ))
