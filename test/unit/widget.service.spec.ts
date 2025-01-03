import { WidgetService } from '../../src/application/widget/widget.service';
import { WidgetRepository } from '../../src/domain/ports/repositories/widget.repository';
import { ScreenRepository } from '../../src/domain/ports/repositories/screen.repository';
import { SolutionRepository } from '../../src/domain/ports/repositories/solution.repository';
import { WidgetError } from '../../src/domain/errors/widget.error';
import { jest } from '@jest/globals';

describe('WidgetService', () => {
  let widgetService: WidgetService;
  let mockWidgetRepository: jest.Mocked<WidgetRepository>;
  let mockScreenRepository: jest.Mocked<ScreenRepository>;
  let mockSolutionRepository: jest.Mocked<SolutionRepository>;

  beforeEach(() => {
    mockWidgetRepository = {
      findById: jest.fn(),
      findByScreen: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockScreenRepository = {
      findById: jest.fn(),
      findBySolution: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockSolutionRepository = {
      findById: jest.fn(),
      findByOwner: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    widgetService = new WidgetService(
      mockWidgetRepository,
      mockScreenRepository,
      mockSolutionRepository
    );
  });

  describe('createWidget', () => {
    const userId = 'user1';
    const validWidget = {
      name: 'Test Widget',
      type: 'bar' as const,
      screenId: 'screen1',
      position: { x: 0, y: 0, width: 2, height: 2 },
      config: {}
    };

    it('should create widget when all validations pass', async () => {
      const screen = {
        id: 'screen1',
        name: 'Test Screen',
        solutionId: 'solution1',
        layout: { columns: 12, rows: 12 },
        widgetIds: []
      };
      const solution = {
        id: 'solution1',
        name: 'Test Solution',
        ownerId: userId,
        description: 'A solution for testing', 
        screenIds: [], 
      };

      mockScreenRepository.findById.mockResolvedValue(screen);
      mockSolutionRepository.findById.mockResolvedValue(solution);
      mockWidgetRepository.create.mockResolvedValue({ ...validWidget, id: 'widget1' });

      const result = await widgetService.createWidget(validWidget, userId);

      expect(result).toBeDefined();
      expect(result.id).toBe('widget1');
      expect(mockWidgetRepository.create).toHaveBeenCalledWith(validWidget);
    });

    it('should throw error when screen not found', async () => {
      mockScreenRepository.findById.mockResolvedValue(null);

      await expect(widgetService.createWidget(validWidget, userId))
        .rejects
        .toThrow(WidgetError);
    });
  });
});