from collections.abc import Sequence
import pygame
from math import sqrt, cos, sin, pi, floor, hypot
from random import random,randint

resolution = 800,800
mid_screen = tuple(map(lambda i:i*.5, resolution))

screen = pygame.display.set_mode(resolution)
clock = pygame.time.Clock()


class Vector(Sequence):
    def __init__(self, P, Q=None):
        if Q:
            self.length = min((len(P), len(Q)))
            self.value = tuple(Q[i] - P[i] for i in range(self.length))
        else:
            if type(P) is int:
                self.length = P
                self.value = tuple(0 for i in range(P))
            else:
                self.length = len(P)
                self.value = tuple(P)
        super().__init__()
    def add(self, *v):      return self.map(lambda e,i:e+sum(map(lambda a:a[i],v)))
    def subtract(self, *v): return self.map(lambda e,i:e-sum(map(lambda a:a[i],v)))
    def multiply(self, n):  return self.map(lambda e,i:e*n)
    def map(self, callback):
        self.value = tuple(callback(self[i], i) for i in range(self.length))
        return self
    def setValue(self, a): self.value = tuple(a)
    def getNorm(self): return hypot(*self.value)
    def setNorm(self, n):
        a = self.getNorm()
        if a!=0: self.multiply(n/a)
        return self
    def getOpposite2D(self): return Vector((self[1], -self[0]))
    def __getitem__(self, i): return self.value[i]
    def __len__(self): return self.length
    def rotate(self, a, origin=(0,0)):
        origin = Vector(origin)
        c,s = (cos(a),sin(a)) if type(a) is float or type(a) is int else a
        v = Vector(origin, self.value)
        self.value = origin.add((c*v[0]-s*v[1],c*v[1]+s*v[0])).value
        return self
    def inInterval(self, x1,y1,x2,y2): return x1<self[0]<x2 and y1<self[1]<y2
    norm = property(getNorm,setNorm)
    opposite2D = property(getOpposite2D)

pygame.font.init()
class Case:
    open_color = 0xcc9922
    close_color = 0x22cc22
    hover_color = 0x119911
    def __init__(self, pos, r, index, coord):
        self.index = index
        self.pos = pos
        self.coord = coord
        self.r = r
        self.rect = tuple((cos(i*pi/3)*r+pos[0],sin(i*pi/3)*r+pos[1]) for i in (0,1,2,3,4,5))
        if index == -1:
            size = r*3,r*3
            self.img_rect = pos[0]-r*3/2,pos[1]-r*3/2,r*3,r*3
            self.img = pygame.transform.scale(pygame.image.load("explosion.png"),tuple(map(int, size)))
        else:
            font = pygame.font.Font("assets/FreeSansBold.ttf", int(r*.75))
            self.img = font.render(str(index), True, 0)
            size = self.img.get_width(), self.img.get_height()
            self.img_rect = Vector(size).multiply(-.5).add(pos).value+size
        self.hovered = False
        self.open = False
        self.neighbors= ()
    def display(self):
        if self.open:
            pass
            # pygame.draw.polygon(screen, Case.open_color, self.rect)
        else:
            pygame.draw.polygon(screen, Case.hover_color if self.hovered else Case.close_color, self.rect)
    def displayN(self):
        if self.open:
            screen.blit(self.img, self.img_rect)
    def setOpen(self):
        self.open = True
        if self.index == 0:
            # print(self.coord)
            # print(*map(lambda e: e.coord, self.neighbors))
            opencases.append([10,tuple(n for n in self.neighbors if not n.open)])
            # for n in self.neighbors:
            #     if not n.open:
            #         n.setOpen()
    neighbors1 = (0,-1),(0,-2),(1,-1),(0,1),(0,2),(1,1)
    neighbors2 = (-1,-1),(0,-2),(0,-1),(-1,1),(0,2),(0,1)

class Floor:
    def __init__(self, width, height):
        self.r = r = min(resolution[0]/(width+1)/1.5, resolution[1]/(height+2)*sqrt(5))
        n = height*width/10
        i=0
        alreadySelected = {i:False for i in range(height*width)}
        mines = [[0 for i in range(width)] for j in range(height)]
        while i<n:
            next_mine = randint(0,width-1),randint(0,height-1)
            if not alreadySelected[next_mine[1]*width+next_mine[0]]:
                i+=1
                mines[next_mine[1]][next_mine[0]] = -1
                alreadySelected[next_mine[1]*width+next_mine[0]]=True
                for neighbor in (Case.neighbors1 if next_mine[1]%2 else Case.neighbors2):
                    npos = Vector(neighbor).add(next_mine)
                    if npos.inInterval(-1,-1,width,height) and mines[npos[1]][npos[0]]!=-1:
                        mines[npos[1]][npos[0]]+=1
        self.mat = [[Case(((i+(.5 if j%2 else 0))*r*1.5+r,j*r*sqrt(3)/4+r), r*.5, mines[j][i], (i,j)) for i in range(width)] for j in range(height)]
        for i in range(height):
            for j in range(width):
                self.mat[i][j].neighbors = tuple(self.mat[n[1]+i][n[0]+j] for n in (Case.neighbors1 if i%2 else Case.neighbors2) if Vector(n).add((j,i)).inInterval(-1,-1,width,height))
        self.origin = r,r
        self.height = height
        self.width = width
    def display(self):
        for j in self.mat:
            for i in j: i.display()
        for j in self.mat:
            for i in j: i.displayN()
    def coordinate(self, coord):
        c = list(Vector(coord, self.origin).value)
        # c[1]*=-4/sqrt(3)/self.r
        # c[0]/=self.r
        closest = (999,)
        for j in self.mat:
            for i in j:
                d = Vector(i.pos, coord).norm
                if d<closest[0]:
                    closest = d,i
        return closest[1]





fl = Floor(12,41)
c = fl.mat[0][0]
RUN = True

opencases = []

while RUN:
    screen.fill(Case.open_color)
    mpos = pygame.mouse.get_pos()
    c.hovered = False
    c = fl.coordinate(mpos)
    c.hovered = True
    fl.display()
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            RUN = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            c.setOpen()
    for j in range(len(opencases)-1,-1,-1):
        n=opencases[j]
        n[0]-=1
        if not n[0]:
            for i in n[1]:
                i.setOpen()
            del opencases[j]
    pygame.display.flip()
    clock.tick(60)
pygame.quit()