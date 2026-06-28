import express from 'express';
import { CountryModel, type CountryInput } from '../models/Country';
import { validateInput, authenticateAdmin } from '../middleware/validation';

const router = express.Router();

/**
 * GET /api/countries
 * Get all countries
 */
router.get('/', async (req, res) => {
  try {
    const { active, continent, search, language } = req.query;
    
    let countries;
    
    if (search && typeof search === 'string') {
      const lang = (language as 'ar' | 'en' | 'fr') || 'ar';
      countries = await CountryModel.search(search, lang, active !== 'false');
    } else if (continent && typeof continent === 'string') {
      countries = await CountryModel.findByContinent(continent, active !== 'false');
    } else {
      countries = await CountryModel.findAll(active !== 'false');
    }
    
    res.json({
      success: true,
      data: countries,
      count: countries.length
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries'
    });
  }
});

/**
 * GET /api/countries/statistics
 * Get countries statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const stats = await CountryModel.getStatistics();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

/**
 * GET /api/countries/:id
 * Get country by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const country = await CountryModel.findById(id);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: 'Country not found'
      });
    }
    
    res.json({
      success: true,
      data: country
    });
  } catch (error) {
    console.error('Error fetching country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch country'
    });
  }
});

/**
 * POST /api/countries
 * Create new country (Admin only)
 */
router.post('/', authenticateAdmin, validateInput([
  'name_ar', 'name_en', 'name_fr',
  'capital_ar', 'capital_en', 'capital_fr',
  'description_ar', 'description_en', 'description_fr',
  'continent', 'main_image',
  'currency_ar', 'currency_en', 'currency_fr',
  'language_ar', 'language_en', 'language_fr',
  'best_time_ar', 'best_time_en', 'best_time_fr'
]), async (req, res) => {
  try {
    const countryData: CountryInput = req.body;
    const userId = req.user?.id;
    
    const country = await CountryModel.create(countryData, userId);
    
    res.status(201).json({
      success: true,
      data: country,
      message: 'Country created successfully'
    });
  } catch (error) {
    console.error('Error creating country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create country'
    });
  }
});

/**
 * PUT /api/countries/:id
 * Update country (Admin only)
 */
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const countryData: Partial<CountryInput> = req.body;
    const userId = req.user?.id;
    
    const country = await CountryModel.update(id, countryData, userId);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        error: 'Country not found'
      });
    }
    
    res.json({
      success: true,
      data: country,
      message: 'Country updated successfully'
    });
  } catch (error) {
    console.error('Error updating country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update country'
    });
  }
});

/**
 * DELETE /api/countries/:id
 * Delete country (Admin only) - Soft delete
 */
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const deleted = await CountryModel.delete(id, userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Country not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Country deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete country'
    });
  }
});

/**
 * DELETE /api/countries/:id/permanent
 * Permanently delete country (Admin only)
 */
router.delete('/:id/permanent', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const deleted = await CountryModel.hardDelete(id, userId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Country not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Country permanently deleted'
    });
  } catch (error) {
    console.error('Error permanently deleting country:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to permanently delete country'
    });
  }
});

export default router;
