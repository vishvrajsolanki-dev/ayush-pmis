import random
class SeededRng:
    def __init__(self,seed=42):
        self.rng=random.Random(seed)
    def int(self,a,b):
        return self.rng.randint(a,b)
    def choice(self,seq):
        return self.rng.choice(seq)
    def shuffle(self,seq):
        self.rng.shuffle(seq)
        return seq
